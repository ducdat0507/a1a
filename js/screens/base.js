screens.base = () => {

    let isMenuOpen = false;

    scene.append(controls.base({
        position: Ex(0, 0, 0, 0),
        size: Ex(0, 0, 1, 1),
        onpointerup() {
            this.onpointerup = () => {};
        },
    }), "base");

    let machine;
    scene.append(machine = controls.rect({
        position: Ex(20, 20, 0, 1),
        size: Ex(-40, -40, 1, 1),
        radius: 30,
        fill: "#2f2f2f",
    }), "machine");

    let machineBody;
    machine.append(machineBody = controls.base({
        position: Ex(0, 0, 0, 0),
        size: Ex(0, 0, 1, 1),
    }), "body");

    machineBody.append(controls.label({
        position: Ex(0, -150, 0.5, 0.5),
        text: "A =",
        scale: 16,
        fill: "#8f8f8f",
    }), "label");

    machineBody.append(controls.rect({
        position: Ex(20, -110, 0, 0.5),
        size: Ex(-40, 200, 1, 0),
        radius: 10,
        fill: "#000000",
    }), "valueBackground");

    machineBody.append(controls.counter({
        position: Ex(0, -10, 0.5, 0.5),
        size: Ex(0, 0, 0, 0),
        scale: 150,
        digits: 6,
        value: gameData.number,
        fill: "#ffffff",
    }), "value");

    machineBody.append(controls.rect({
        position: Ex(-80, 180, 0.5, 1),
        size: Ex(160, 160, 0, 0),
        radius: 80,
        fill: "#1f1f1f",
    }), "button");

    machineBody.$button.append(controls.rect({
        position: Ex(0, 0, 0, 0),
        size: Ex(0, 0, 1, 1),
        radius: 80,
        fill: "#4f4f4f",
    }), "pop");

    machineBody.append(controls.rect({
        position: Ex(110, 190, 0.5, 1),
        size: Ex(100, 100, 0, 0),
        radius: 50,
        fill: "#1f1f1f",
    }), "menuBtn");

    machineBody.$menuBtn.append(controls.rect({
        position: Ex(0, 0, 0, 0),
        size: Ex(0, 0, 1, 1),
        radius: 50,
        fill: "#4f4f4f",
    }), "pop");

    function setZoom(value) {
        machineBody.position.x = machineBody.position.y
            = -(machine.position.x = 20 * value) + 20;
        machineBody.size.x = machineBody.size.y
            = -(machine.size.x = machine.size.y = -40 * value) - 40;
        machine.radius = 30 * value;
        machine.mask = value > 0;
    }
    setZoom(1);

    function makePushyButton(button, pop, events = {}, popValue = 10) {
        let buttonDown = 0;

        button.onpointerin = () => {
            pushCursor("pointer");
        }
        button.onpointerout = () => {
            popCursor();
        }
        button.onupdate = () => {
            if (!buttonDown) pop.position.y += (-popValue - pop.position.y) * 0.978 ** delta;
        }
        button.onpointerdown = (e) => {
            if (!buttonDown) {
                events.push?.();
                pop.position.y = 0;
            }
            buttonDown++;
            let handler = (e) => {
                buttonDown--;
                events.click?.();
                document.removeEventListener("pointerup", handler);
            }
            document.addEventListener("pointerup", handler);
        }
    }
    
    tween(1000, (t) => {
        let machine = scene.$machine;
        machine.position.y = ease.cubic.out(t) + 20;
        machine.position.ey = 1 - ease.cubic.out(t);
    }).then(() => {
        tween(500, (t) => {
            let value = 1 - ease.cubic.out(t);
            setZoom(value);
            machine.position.y = 20 * value;
        }) 
        return tween(1500, (t) => {
            let value = ease.cubic.out(Math.min(t * 1.5, 1));
            machineBody.$button.position.y = 180 - 360 * value;
            let value2 = ease.cubic.out(t * 1.5 - .5);
            machineBody.$menuBtn.position.y = 580 - 720 * value;
        })
    }).then(() => {
        let valueLabel = machineBody.$value

        makePushyButton(machineBody.$button, machineBody.$button.$pop, {
            push() {
                valueLabel.value = ++gameData.number;
                save();
            }
        })
        makePushyButton(machineBody.$menuBtn, machineBody.$menuBtn.$pop, {
            click() {
                isMenuOpen = !isMenuOpen;
                if (isMenuOpen) tween(800, (t) => {
                    let value = ease.cubic.out(t);
                    setZoom(value);
                    let value2 = ease.back.out(t) ** .5 * ease.cubic.out(Math.min(t * 2, 1));
                    machine.position.y = value2 * -500;
                })
                else tween(600, (t) => {
                    let value = ease.cubic.out(t);
                    setZoom(1 - value);
                    let value2 = ease.cubic.out(t);
                    machine.position.y = (1 - value2) * -500;
                }) 
            }
        }, 5)
    })
}