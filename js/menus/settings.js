menus.settings = (openMenu, closeMenu) => {

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Settings",
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
        radius: 20,
        mask: true,
    })
    menu.append(box, "box");

    let scroller = controls.scroller({
        size: Ex(0, 0, 1, 1),
        mask: true,
    })
    box.append(scroller);

    function makeButton(title, onClick) {
        let ctrl;
        scroller.$content.append(ctrl = controls.button({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#3f3f3f",
            radius: 20,
            onClick
        }))

        ctrl.append(controls.label({
            position: Ex(25, 28, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        scroller.$content.size.y += 90;
    }

    makeButton("Save", () => {
        save();
    });
    scroller.$content.size.y += 1500;
    makeButton("Hard reset", () => {
        totalDestruction();
    });


    let lerpItems = [
        [backBtn, 40],
    ]
    for (let ctrl of scroller.$content.controls) {
        let delay = (mainCanvas.height / scale - ctrl.position.y) * .35 + 20;
        if (delay > 40) lerpItems.push([ctrl, delay]);
        else break;
    }
    doItemReveal(lerpItems);

    return menu
}