menus.customize = (openMenu, closeMenu) => {

    let currentView = "";
    let currentViewBox = null;
    let currentViewScroller = null;


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
        text: formatFixed(gameData.res.square),
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
        text: `(+${formatFixed(getSquareGain())} / 1k)`,
    }), "squareSpeed");

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
            radius: 20,
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
        machines[machInfo.type].prefs[view].makeItems(
            currentViewScroller.$content, 
            machines[machInfo.type].prefs[view].items()
        );

        tween(500, (t) => {
            if (!currentView) return true;

            let value = ease.back.out(t) ** .3;
            currentViewBox.position.x = 
                (currentViewBox.position.ex = 1 - value) * 40;
            currentViewBox.alpha = value;
            box.position.x = 
                (box.position.ex = -value) * 40;
            box.alpha = 1 - value;
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
        }).then(() => {
            if (currentView) return;
            menu.remove(currentViewBox);
            currentViewBox = currentViewScroller = null;
        })
    }



    return menu
}