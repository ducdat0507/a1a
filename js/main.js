let ctx;

function init() {
    ctx = mainCanvas.getContext("2d");
    window.onpointerdown = onCanvasPointerDown;
    window.onpointerup = onCanvasPointerUp;
    window.oncontextmenu = e => false;
    load();

    scene.append(controls.base({
        position: { fx: 0, fy: 0, sx: 0, sy: 0 },
        size: { fx: 0, fy: 0, sx: 1, sy: 1 },
        onclick() {
            this.onclick = () => {};
            startAnimation((t) => {
                t = Math.min(t / 4000, 1);
                let machine = scene._base._machine;
                machine.position.fy = ease.quart.inout(t) * -20 + 45;
                machine.position.sy = 1 - ease.quart.inout(t);
                if (t >= 1) {
                    let button = scene._base._machine._button
                    let valueLabel = scene._base._machine._button._value
                    button.onupdate = () => {
                        button.position.fy += (-12 - button.position.fy) * 0.978 ** delta;
                    }
                    button.onpointerdown = (e) => {
                        console.log(e.touches);
                        if (!e.touches || e.touches.length <= 4) {
                            gameData.number++;
                            valueLabel.text = formatFixed(gameData.number);
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
        size: { fx: -40, fy: -45, sx: 1, sy: 1 },
        radius: 30,
        fill: "#1f1f1f",
    }), "machine");

    scene._base._machine.append(controls.rect({
        position: { fx: 0, fy: 0, sx: 0, sy: 0 },
        size: { fx: 0, fy: 0, sx: 1, sy: 1 },
        radius: 30,
        fill: "#4f4f4f",
    }), "button");

    scene._base._machine._button.append(controls.label({
        position: { fx: 0, fy: -80, sx: 0.5, sy: 0.5 },
        fontSize: 16,
        text: "A =",
        fill: "#8f8f8f",
    }), "label");

    scene._base._machine._button.append(controls.rect({
        position: { fx: 20, fy: -60, sx: 0, sy: 0.5 },
        size: { fx: -40, fy: 120, sx: 1, sy: 0 },
        radius: 10,
        fill: "#000000",
    }), "valueBackground");

    scene._base._machine._button.append(controls.label({
        position: { fx: 0, fy: 5, sx: 0.5, sy: 0.5 },
        fontSize: 120,
        // font: "Wire One",
        text: formatFixed(gameData.number),
        fill: "#ffffff",
    }), "value");

    loop();
}

let time = Date.now();
let saveTime = 0;
let delta = 0;

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
    scale = Math.min(width / 600, window.devicePixelRatio);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    updateAnimations();
    renderControls(scene.controls, { x: 0, y: 0, width, height });

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

function onCanvasPointerDown(e) {
    let pos = { x: e.clientX, y: e.clientY };
    doPointerEvent(pos, scene.controls, "onpointerdown", e);
    e.preventDefault();
}

function onCanvasPointerUp(e) {
    let pos = { x: e.clientX, y: e.clientY };
    doPointerEvent(pos, scene.controls, "onclick", e);
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