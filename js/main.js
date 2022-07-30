let ctx;

function init() {
    ctx = mainCanvas.getContext("2d");
    window.ontouchstart = onCanvasTouchStart;
    window.onmousedown = onCanvasMouseDown;
    window.ontouchend = onCanvasTouchEnd;
    window.onmouseup = onCanvasMouseUp;
    window.oncontextmenu = e => false;
    load();

    scene.append(controls.base({
        position: { fx: 0, fy: 0, sx: 0, sy: 0 },
        size: { fx: 0, fy: 0, sx: 1, sy: 1 },
        onclick() {
            this.onclick = () => {};
            startAnimation((t) => {
                t = Math.min(t / 3000, 1);
                let machine = scene._base._machine;
                machine.position.fy = ease.quart.inout(t) * -6 + 40;
                machine.position.sy = 1 - ease.quart.inout(t);
                if (t >= 1) {
                    let button = scene._base._machine._button
                    let labelLabel = scene._base._machine._button._label
                    let valueLabel = scene._base._machine._button._value
                    button.onupdate = () => {
                        button.position.fy += (-12 - button.position.fy) * 0.978 ** delta;
                    }
                    button.onpointerdown = (e) => {
                        console.log(e.touches);
                        if (!e.touches || e.touches.length <= 4) {
                            gameData.number++;
                            valueLabel.value = gameData.number;
                            button.position.fy = -3;
                        }
                    }
                    return true;
                }
            })
        },
    }), "base");

    scene._base.append(controls.rect({
        position: { fx: 20, fy: 40, sx: 0, sy: 1 },
        size: { fx: -40, fy: -50, sx: 1, sy: 1 },
        radius: 30,
        fill: "#1f1f1f",
    }), "machine");

    scene._base._machine.append(controls.label({
        position: { fx: -200, fy: -150, sx: 0.5, sy: -0.5 },
        text: "A+1→A",
        scale: 64,
        align: "left",
        fill: "#ffffff",
    }), "title");

    scene._base._machine.append(controls.label({
        position: { fx: -200, fy: -80, sx: 0.5, sy: -0.5 },
        size: { fx: 400, fy: 0, sx: 0, sy: 0 },
        text: "- a simulation of adding the number 1 repeatedly to a variable on a calculator, and enjoying doing it.",
        scale: 16,
        wrap: true,
        align: "left",
        style: "italic",
        fill: "#ffffff",
    }), "description");

    scene._base._machine.append(controls.rect({
        position: { fx: 0, fy: 0, sx: 0, sy: 0 },
        size: { fx: 0, fy: 0, sx: 1, sy: 1 },
        radius: 30,
        fill: "#4f4f4f",
    }), "button");

    scene._base._machine._button.append(controls.label({
        position: { fx: 0, fy: -90, sx: 0.5, sy: 0.5 },
        text: "A =",
        scale: 16,
        fill: "#8f8f8f",
    }), "label");

    scene._base._machine._button.append(controls.rect({
        position: { fx: 20, fy: -60, sx: 0, sy: 0.5 },
        size: { fx: -40, fy: 120, sx: 1, sy: 0 },
        radius: 10,
        fill: "#000000",
    }), "valueBackground");

    scene._base._machine._button.append(controls.counter({
        position: { fx: 0, fy: 0, sx: 0.5, sy: 0.5 },
        size: { fx: 0, fy: 0, sx: 0, sy: 0 },
        scale: 90,
        value: gameData.number,
        fill: "#ffffff",
    }), "value");

    loop();
}

let time = Date.now();
let saveTime = 0;
let delta = 0;
let strain = 0;

let scene = controls.base();
let scale = 1;

function loop() {
    delta = Date.now() - time;
    time += delta;
    saveTime += delta;
    if (saveTime > 15000) {
        save();
        saveTime = 0;
    }

    let width = mainCanvas.width = window.innerWidth;
    let height = mainCanvas.height = window.innerHeight;
    scale = Math.min(width / 600, height / 800, window.devicePixelRatio);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    updateAnimations();
    renderControls(scene.controls, { x: 0, y: 0, width, height });

    strain = Date.now() - time;
    window.requestAnimationFrame(loop);
}

function renderControls(cts, rect) {
    for (let ct of cts) {
        ct.rect = {
            x: ct.position.fx * scale + ct.position.sx * rect.width + rect.x,
            y: ct.position.fy * scale + ct.position.sy * rect.height + rect.y,
            width: ct.size.fx * scale + ct.size.sx * rect.width,
            height: ct.size.fy * scale + ct.size.sy * rect.height,
        }
        ct.render();
        ct.onupdate();
        if (ct.controls.length) renderControls (ct.controls, ct.rect);
    }
}

let pointers = {};

function onCanvasMouseDown(e) {
    let pos = { x: e.clientX, y: e.clientY };
    doPointerEvent(pos, scene.controls, "onpointerdown", e);
    e.preventDefault();
}

function onCanvasTouchStart(e) {
    for (let touch of e.changedTouches) {
        let pos = { x: touch.clientX, y: touch.clientY };
        touch.touches = e.touches;
        doPointerEvent(pos, scene.controls, "onpointerdown", touch);
    }
    e.preventDefault();
}

function onCanvasMouseUp(e) {
    let pos = { x: e.clientX, y: e.clientY };
    doPointerEvent(pos, scene.controls, "onclick", e);
    e.preventDefault();
}

function onCanvasTouchEnd(e) {
    for (let touch of e.changedTouches) {
        let pos = { x: touch.clientX, y: touch.clientY };
        touch.touches = e.touches;
        doPointerEvent(pos, scene.controls, "onclick", touch);
    }
    e.preventDefault();
}

function doPointerEvent(pos, cts, event, args) {
    for (let ct of cts) {
        if (pos.x >= ct.rect.x && pos.y >= ct.rect.y
            && pos.x <= ct.rect.x + ct.rect.width
            && pos.y <= ct.rect.y + ct.rect.height) {
            ct[event](args);
        }
        if (ct.controls.length) doPointerEvent(pos, ct.controls, event, args);
    }
}