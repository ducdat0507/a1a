menus.shop = (openMenu, closeMenu) => {


    // Menu

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Store",
    }, "box")
    
    let backBtn = controls.button({
        position: Ex(0, -80, 0, 1),
        size: Ex(80, 80, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 40,
        onClick: () => closeMenu(),
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

    // Currency display

    let machine = getCurrentMachine();

    let resBox = controls.rect({
        position: Ex(10, 30),
        size: Ex(-20, 90, 1, 0),
        fill: "#1f1f1f",
        radius: 20,
    })
    menu.append(resBox, "resBox");
    
    resBox.append(controls.label({
        position: Ex(-40, 60, 0.5, 0),
        scale: 24,
        align: "right",
    }), "pentAmount");
    resBox.append(controls.icon({
        position: Ex(-16, 58, 0.5, 0),
        scale: 32,
        icon: "pentagon-filled",
        fill: "#cbf",
    }), "pentIcon");
    
    resBox.append(controls.label({
        position: Ex(-74, 60, 1, 0),
        scale: 24,
        align: "right",
    }), "circleAmount");
    resBox.append(controls.icon({
        position: Ex(-50, 58, 1, 0),
        scale: 32,
        icon: "circle-filled",
        fill: "#fff",
    }), "circleIcon");


    function updateResBox() {
        resBox.$pentAmount.text = formatFixed(gameData.res.pent);
        resBox.$circleAmount.text = formatFixed(gameData.res.circle[machine.type] ?? 0);
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

    return menu
}