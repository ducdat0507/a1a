screens.base = () => {

    // -------------------- Variables

    let menuHierarchy = [];
    let isAnimating = false;

    // -------------------- Init machine

    let menuHolder
    scene.append(menuHolder = controls.base({
        position: Ex(-280, 20, 0.5, 0),
        size: Ex(560, -40, 0, 1),
    }), "menu");

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

    let machData = getCurrentMachine()
    machines[machData.type].setup(machineBody, machData);
    machineBody.setValue(gameData.value);

    // -------------------- Machine buttons

    function pushyButtonTemplate(id, args, icon, icon2) {
        let btn;
        machineBody.append(btn = controls.rect({
            ...args,
            fill: "#1f1f1f",
        }), id);
    
        btn.append(controls.rect({
            ...args,
            position: Ex(0, 0, 0, 0),
            size: Ex(0, 0, 1, 1),
            fill: "#4f4f4f",
            mask: true,
        }), "pop");
    
        btn.$pop.append(controls.icon({
            position: Ex(0, 0, 0.5, 0.5),
            scale: args.radius,
            icon: icon,
            fill: "#000000",
        }), "icon");
    
        btn.$pop.append(controls.icon({
            position: Ex(0, 0, 0.5, 1.5),
            scale: args.radius,
            icon: icon2,
            fill: "#000000",
        }), "icon2");

        return btn;
    }

    function makePushyButton(button, pop, events = {}, popValue = 10) {
        let buttonDown = 0;

        button.onPointerEnter = () => {
            pushCursor("pointer");
        }
        button.onPointerLeave = () => {
            popCursor();
        }
        button.onUpdate = () => {
            if (!buttonDown) pop.position.y += (-popValue - pop.position.y) * (1 - 0.978 ** delta);
        }
        button.onPointerDown = (e) => {
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

    pushyButtonTemplate("button", {
        position: Ex(-80, 180, 0.5, 1),
        size: Ex(160, 160, 0, 0),
        radius: 80,
    }, "exposure-plus-1", "arrow-down");

    pushyButtonTemplate("menuBtn", {
        position: Ex(120, 190, 0.5, 1),
        size: Ex(100, 100, 0, 0),
        radius: 50,
    }, "category", "arrow-right");

    // -------------------- Menu
    
    let menuHeader;
    machine.append(menuHeader = controls.label({
        position: Ex(25, -38, 0, 1),
        scale: 32,
        align: "left",
        style: "700",
    }), "header");

    function setZoom(value) {
        machineBody.position.x = machineBody.position.y
            = -(machine.position.x = 20 * value) + 20;
        machineBody.size.x = machineBody.size.y
            = -(machine.size.x = machine.size.y = -40 * value) - 40;
        machine.radius = 30 * value;
        machine.mask = value > 0;
    }
    setZoom(1);

    let headerLerp = 0;
    function setButtonOffset(value) {
        machineBody.$button.position.y = -180 - 20 * value - 50 * headerLerp;
        machineBody.$menuBtn.position.x = 120 - 20 * value;
        machineBody.$menuBtn.position.y = -150 + 250 * value - 50 * headerLerp;

        for (let btn of [machineBody.$button, machineBody.$menuBtn]) {
            btn.$pop.$icon.position.ey = 0.5 - value;
            btn.$pop.$icon2.position.ey = 1.5 - value;
        }
    }

    function openMenu(menu) {
        if (isAnimating) return;
        let elm = menus[menu](openMenu, closeMenu);
        menuHierarchy.push(elm);

        let lastY = menuHolder.$body?.position.y;
        tween(150, (t) => {
            if (!menuHolder.$body) return true
            menuHeader.alpha = menuHolder.$body.alpha = 1 - t;
            menuHolder.$body.position.y = lastY - 50 * ease.cubic.in(t);
        }).then(() => {
            if (menuHolder.$body) menuHolder.remove(menuHolder.$body);
            menuHolder.append(elm, "body");
            menuHeader.text = elm.menuTitle ?? "";
            tween(100, (t) => {
                menuHeader.alpha = t;
            })
        })
        
        if (!!elm.menuTitle ^ !!menuHeader.text) animateHeader(!!elm.menuTitle);

        if (menu == "main") animateMenu(-500, 0);
        else animateMenu(120, -1);
    }

    function closeMenu() {
        if (isAnimating) return;
        menuHierarchy.splice(menuHierarchy.length - 1);
        
        let lastY = menuHolder.$body.position.y;
        let last = menuHierarchy[menuHierarchy.length - 1];
        tween(150, (t) => {
            menuHeader.alpha = menuHolder.$body.alpha = 1 - t;
            menuHolder.$body.position.y = lastY + 50 * ease.cubic.in(t);
        }).then(() => {
            menuHolder.remove(menuHolder.$body);
            if (last) {
                menuHolder.append(last, "body");
                let lastY = menuHolder.$body.position.y;
                menuHeader.text = last.menuTitle ?? "";
                return tween(150, (t) => {
                    menuHeader.alpha = menuHolder.$body.alpha = t;
                    menuHolder.$body.position.y = lastY + 50 * ease.cubic.out(t);
                })
            }
        })

        if (!!last?.menuTitle ^ !!menuHeader.text) animateHeader(!!last.menuTitle);

        if (menuHierarchy.length == 1) animateMenu(-500, 0);
        else if (menuHierarchy[0]) animateMenu(100, 1);
        else animateMenu(0, 0, false);
    }

    function animateMenu(targetY, targetEy, bounce = true) {
        isAnimating = true;
        let lastY = machine.position.y;
        let lastEy = machine.position.ey;
        let targetZoom = +(targetY != 0 || targetEy != 0);
        let lastZoom = +(lastY != 0 || lastEy != 0);

        if (bounce) tween(600, (t) => {
            let value = ease.cubic.out(t);
            setZoom(lerp(lastZoom, targetZoom, value));
            let value2 = ease.back.out(t) ** .5 * ease.cubic.out(Math.min(t * 2, 1));
            setButtonOffset(lerp(lastZoom, targetZoom, value2));
            machine.position.y = lerp(lastY, targetY, value2);
            machine.position.ey = lerp(lastEy, targetEy, value2);
        }).then(() => {isAnimating = false});
        else tween(400, (t) => {
            let value = ease.cubic.out(t);
            setZoom(lerp(lastZoom, targetZoom, value));
            let value2 = ease.cubic.out(t);
            setButtonOffset(lerp(lastZoom, targetZoom, value2));
            machine.position.y = lerp(lastY, targetY, value2);
            machine.position.ey = lerp(lastEy, targetEy, value2);
        }).then(() => {isAnimating = false});
    }

    function animateHeader(target) {
        if (target) tween(600, (t) => {
            headerLerp = ease.back.out(t) ** .5 * ease.cubic.out(Math.min(t * 2, 1));
            setButtonOffset(1);
        });
        else tween(600, (t) => {
            headerLerp = 1 - ease.back.out(t) ** .5 * ease.cubic.out(Math.min(t * 2, 1));
            setButtonOffset(1);
        });
    }

    // -------------------- Intro
    
    isAnimating = true;
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
        makePushyButton(machineBody.$button, machineBody.$button.$pop, {
            push() {
                if (!menuHierarchy[0]) {
                    machineBody.setValue(++gameData.number);
                    if (gameData.number % 1000 == 0) gameData.res.square += getSquareGain();
                    if (gameData.number % 10000 == 0) gameData.res.pent++;
                    if (gameData.number % 100000 == 0) gameData.res.hex++;
                    save();
                }
            },
            click() {
                if (menuHierarchy[0]) closeMenu();
            },
        })
        makePushyButton(machineBody.$menuBtn, machineBody.$menuBtn.$pop, {
            click() {
                if (!menuHierarchy[0]) openMenu("main");
            },
        }, 8)
        
        isAnimating = false;
    })
}