let mainCanvas
let ctx;

let version = "1.0";
let versionIndex = 5;

function init() {
    mainCanvas = document.getElementById("main-canvas");
    ctx = mainCanvas.getContext("2d");

    bindPointerEvent("onpointerdown", "mousedown", "touchstart");
    bindPointerEvent("onpointermove", "mousemove", "touchmove");
    bindPointerEvent("onpointerup", "mouseup", "touchend");
    bindPointerEvent("onmousewheel", "wheel");
    window.oncontextmenu = e => false;
    
    load();
    loadScreen("base");

    loop();
}

let time = performance.now();
let delta = 0;
let strain = [];
let fps = [];

let scene = controls.base();
let scale = 1;
let resScale = 1;

let screens = {}
let menus = {}
let machines = {}

let currentMode = "";

let debugWireframe = false;

function loop(timestamp) {
    delta = (timestamp ?? performance.now()) - time;
    time += delta;
    fps.push(delta);
    if (fps.length > 60) fps.shift();
    delta = Math.max(Math.min(delta, 1000), 0);

    resScale = 1;
    let width = mainCanvas.width = window.innerWidth * resScale;
    let height = mainCanvas.height = window.innerHeight * resScale;
    scale = Math.min(width / 600, height / 800, window.devicePixelRatio * resScale);

    ctx.lineJoin = "round";

    updateAnimations();
    updateInMouseState(scene.controls);
    renderControls(scene.controls, { x: 0, y: 0, width, height });

    strain.push(performance.now() - time);
    if (strain.length > 10) strain.shift();
    window.requestAnimationFrame(loop);
}

function renderControls(cts, rect, alpha = 1) {
    for (let ct of cts) {
        ct.rect = Rect(
            ct.position.x * scale + ct.position.ex * rect.width + rect.x,
            ct.position.y * scale + ct.position.ey * rect.height + rect.y,
            ct.size.x * scale + ct.size.ex * rect.width,
            ct.size.y * scale + ct.size.ey * rect.height,
        );
        let a = alpha * ct.alpha;
        ctx.globalAlpha = a;
        ct.onupdate();
        if (a > 0) {
            if (ct.mask) { 
                ctx.save();
                ctx.beginPath();
                if (ct.getBoundingPath) {
                    ct.getBoundingPath();
                } else {
                    ctx.lineTo(ct.rect.x, ct.rect.y);
                    ctx.lineTo(ct.rect.x + ct.rect.width, ct.rect.y);
                    ctx.lineTo(ct.rect.x + ct.rect.width, ct.rect.y + ct.rect.height);
                    ctx.lineTo(ct.rect.x, ct.rect.y + ct.rect.height);
                }
                ctx.clip();
            }
            ct.render();
        }
        if (ct.controls.length) renderControls (ct.controls, ct.rect, a);
        if (a > 0 && ct.mask) {
            ctx.restore();
        }
        if (debugWireframe) {
            ctx.fillStyle = ctx.strokeStyle = ct.__mouseIn ? "lime" : "white";
            ctx.strokeWidth = 2 * scale;
            ctx.strokeRect(ct.rect.x, ct.rect.y, ct.rect.width, ct.rect.height);
            ctx.font = 10 * scale + "px SF Pro, Inter, sans-serif";
            ctx.textAlign = "left"; ctx.textBaseline = "bottom";
            ctx.fillText(ct.id, ct.rect.x, ct.rect.y);
        }
    }
}

let pointers = {};
let mousePos = { x: 0, y: 0 }
let lastArgs;
let isTouch;
let isDown;

function updateInMouseState(cts, clickthrough = false, did = false, brk = false) {
    let did2 = did;
    for (let ct of [...cts].reverse()) {

        let ctr = clickthrough || ct.clickthrough;
        let inBox = mousePos.x >= ct.rect.x && mousePos.y >= ct.rect.y
            && mousePos.x <= ct.rect.x + ct.rect.width
            && mousePos.y <= ct.rect.y + ct.rect.height;

        if (!ctr && !did && !brk && inBox) {
            if (!ct.__mouseIn) {
                ct.onpointerin(mousePos, lastArgs);
                ct.__mouseIn = true;
            }
            did = true;
        } else {
            if (ct.__mouseIn) {
                ct.onpointerout(mousePos, lastArgs);
                ct.__mouseIn = false;
            }
        }

        if (ct.controls.length) {
            if (updateInMouseState(ct.controls, ctr, did2, brk || (ct.mask && !inBox))) did = true;
        }

        did2 = did;
    }
    return did;
}

function doPointerEvent(pos, cts, event, args, did = false, brk = false) {
    let did2 = did;
    for (let ct of [...cts].reverse()) {
        if (ct.clickthrough) continue;

        let inBox = pos.x >= ct.rect.x && pos.y >= ct.rect.y
            && pos.x <= ct.rect.x + ct.rect.width
            && pos.y <= ct.rect.y + ct.rect.height;

        if (!did && !brk && inBox) {
            ct[event](pos, args);
            did = true;
        }

        if (ct.controls.length) {
            if (doPointerEvent(pos, ct.controls, event, args, did2, brk || (ct.mask && !inBox))) did = true;
        }

        did2 = did;
    }
    return did;
}

function doMouseEvent(e, type) {
    if (type == "onpointerdown") isDown = true;
    else if (type == "onpointerup") isDown = false;
    let pos = mousePos = { x: e.clientX * resScale, y: e.clientY * resScale };
    lastArgs = e;
    doPointerEvent(pos, scene.controls, type, e);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    isTouch = false;
    return false;
}
function doTouchEvent(e, type) {
    if (type == "onpointerdown") isDown = true;
    else if (type == "onpointerup") isDown = false;
    for (let touch of e.changedTouches) {
        let pos = mousePos = { x: touch.clientX * resScale, y: touch.clientY * resScale };
        touch.touches = e.touches;
        lastArgs = touch;
        doPointerEvent(pos, scene.controls, type, touch);
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    isTouch = true;
    return false;
}

function loadScreen(screenName, clear = true) {
    if (clear) scene = controls.base();
    screens[screenName]();
}

function bindPointerEvent(type, mouse, touch) {
    window.addEventListener(mouse, e => doMouseEvent(e, type));
    window.addEventListener(touch, e => doTouchEvent(e, type), { passive: false });
}

let cursors = [];
function pushCursor(cr) {
    cursors.push(cr);
    mainCanvas.style.cursor = cursors[0] ?? "";
}
function popCursor() {
    cursors.shift();
    mainCanvas.style.cursor = cursors[0] ?? "";
}