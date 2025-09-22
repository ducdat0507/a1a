menus.customize = (openMenu, closeMenu) => {

    let currentView = "";
    let currentViewBox = null;
    let currentViewScroller = null;
    let currentViewButton = null;

    // Menu

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Customize",
    }, "box")
    
    let backBtn = controls.button({
        position: Ex(0, -80, 0, 1),
        size: Ex(80, 80, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 40,
        onClick: () => currentView ? unsetView() : closeMenu(),
    })
    menu.append(backBtn, "backBtn");

    backBtn.append(controls.icon({
        position: Ex(0, 0, .5, .5),
        scale: 40,
        icon: "arrow-left",
    }), "icon")


    let box = controls.rect({
        position: Ex(0, 80),
        size: Ex(0, -180, 1, 1),
        fill: "#0000",
        radius: 40,
        mask: true,
    })
    menu.append(box, "box");


    // Item list

    let scroller = controls.scroller({
        position: Ex(0, 0),
        size: Ex(0, 0, 1, 1),
    })
    box.append(scroller);
    scroller.$content.size.y = 60;

    function makeViewButton(item, onClick) {
        let ctrl;
        scroller.$content.append(ctrl = controls.button({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 140, 1, 0),
            fill: "#3f3f3f",
            radius: 20,
            onClick
        }))

        ctrl.append(controls.icon({
            position: Ex(-50, -50, 1, 1),
            scale: 250,
            icon: item.icon,
            fill: "#0003",
        }), "icon")

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 32,
            align: "left",
            text: item.name,
        }), "title")
        ctrl.append(controls.icon({
            position: Ex(-40, 40, 1, 0),
            scale: 40,
            icon: "chevron-right",
        }), "title")


        scroller.$content.size.y += 150;
    }

    let machInfo = getCurrentMachine();
    for (let itemId in machines[machInfo.type].prefs) {
        let item = machines[machInfo.type].prefs[itemId];
        makeViewButton(item, () => setView(itemId));
    }

    // Currency display

    let resBox = controls.rect({
        position: Ex(10, 30),
        size: Ex(-20, 90, 1, 0),
        fill: "#1f1f1f",
        radius: 20,
    })
    menu.append(resBox, "resBox");
    
    resBox.append(controls.label({
        position: Ex(-274, 60, 1, 0),
        scale: 24,
        align: "right",
    }), "squareAmount");
    resBox.append(controls.icon({
        position: Ex(-250, 58, 1, 0),
        scale: 32,
        icon: "square-rotated-filled",
        fill: "#9f5",
    }), "squareIcon");
    resBox.append(controls.label({
        position: Ex(-24, 60, 1, 0),
        scale: 24,
        align: "right",
        fill: "#fffa",
    }), "squareSpeed");

    function updateResBox() {
        resBox.$squareAmount.text = formatFixed(gameData.res.square);
        resBox.$squareSpeed.text = `(+${formatFixed(getSquareGain())} / 1k)`;
    }
    updateResBox();

    let lerpItems = [
        [backBtn, 40],
        [resBox, 150],
    ]
    for (let ctrl of scroller.$content.controls) {
        let delay = (mainCanvas.height / scale - ctrl.position.y) * .35;
        if (delay > 40) lerpItems.push([ctrl, delay]);
        else break;
    }
    doItemReveal(lerpItems);

    function setView(view) {
        if (currentView) return;
        currentView = view;
        if (currentViewBox) menu.remove(currentViewBox);
        
        currentViewBox = controls.rect({
            position: Ex(0, 80, 1, 0),
            size: Ex(0, -180, 1, 1),
            fill: "#0000",
            radius: 40,
            mask: true,
        })
        menu.prepend(currentViewBox);

        currentViewScroller = controls.scroller({
            position: Ex(0, 0),
            size: Ex(0, 0, 1, 1),
        });
        currentViewScroller.$content.size.y = 60;
        currentViewBox.append(currentViewScroller);

        let machInfo = getCurrentMachine();
        let machData = machines[machInfo.type];
        machData.prefs[view].makeItems(
            currentViewScroller.$content, 
            machData.prefs[view].items()
        );

        if (machData.prefs[view].gachaCost) {
            let gachaCost = getGachaCost(machInfo.type, view);

            let gachaButton = controls.button({
                size: Ex(0, 0, 1, 1),
                fill: "#3f3f3f",
                radius: 40,
                onClick: () => {
                    if (gameData.res.square >= gachaCost) {
                        gameData.res.square -= gachaCost;
                        doGachaAnimation(machInfo.type, view, currentViewScroller.$content, () => {
                            updateResBox();
                        })
                        save();
                        updateGachaButton();
                    }
                }
            })
            currentViewButton = controls.base({
                position: Ex(0, -80, 1, 1),
                size: Ex(320, 80),
            })
            menu.append(currentViewButton);
            currentViewButton.append(gachaButton);

            function updateGachaButton() {
                let canBuy = gameData.res.square >= gachaCost;
                gachaButton.clickthrough = !canBuy;
                gachaButton.alpha = canBuy ? 1 : 0.5;
            }
            updateGachaButton();

            gachaButton.append(controls.icon({
                position: Ex(-40, 0, 1, .5),
                scale: 40,
                icon: "circle-half-vertical",
            }), "icon")

            gachaButton.append(controls.icon({
                position: Ex(-86, 0, 1, .5),
                scale: 32,
                icon: "arrow-right",
            }), "arrow")

            gachaButton.append(controls.label({
                position: Ex(-152, 2, 1, .5),
                scale: 28,
                align: "right",
                fill: "white",
                text: gachaCost.toLocaleString("en-US"),
            }), "squareAmount")
            gachaButton.append(controls.icon({
                position: Ex(-128, 0, 1, .5),
                scale: 32,
                icon: "square-rotated-filled",
                fill: "#9f5",
            }), "squareIcon");
        }

        tween(500, (t) => {
            if (!currentView) return true;

            let value = ease.back.out(t) ** .3;
            currentViewBox.position.x = 
                (currentViewBox.position.ex = 1 - value) * 40;
            currentViewBox.alpha = value;
            box.position.x = 
                (box.position.ex = -value) * 40;
            box.alpha = 1 - value;

            if (currentViewButton) {
                currentViewButton.position.x = 
                    (-currentViewButton.size.x) * value
                currentViewButton.alpha = Math.min(value, 1);
            }
        })
        let lerpItems = []
        for (let ctrl of currentViewScroller.$content.controls) {
            let delay = (mainCanvas.height / scale - ctrl.position.y + ctrl.position.ex * 500) * .35 + 20;
            if (delay > 40) lerpItems.push([ctrl, delay]);
            else break;
        }
        doItemReveal(lerpItems);
    }

    function unsetView(view) {
        if (!currentView) return;
        currentView = "";

        tween(500, (t) => {
            if (currentView) return true;

            let value = ease.back.out(t) ** .3;
            currentViewBox.position.x = 
                (currentViewBox.position.ex = value) * 40;
            currentViewBox.alpha = 1 - value;
            box.position.x = 
                (box.position.ex = -1 + value) * 40;
            box.alpha = value;

            if (currentViewButton) {
                currentViewButton.position.x = 
                    (-currentViewButton.size.x) * (1 - value)
                currentViewButton.alpha = 1 - value;
            }
        }).then(() => {
            if (currentView) return;
            menu.remove(currentViewBox);
            currentViewBox = currentViewScroller = currentViewButton = null;
        })
    }



    return menu
}