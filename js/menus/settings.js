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
        onclick: () => closeMenu(),
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
        radius: 30,
        mask: true,
    })
    menu.append(box, "box");

    let scroller = controls.scroller({
        size: Ex(0, 0, 1, 1),
        mask: true,
    })
    box.append(scroller);

    function makeButton(title, onclick) {
        let ctrl;
        scroller.$content.append(ctrl = controls.button({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 72, 1, 0),
            fill: "#3f3f3f",
            radius: 30,
            onclick
        }))

        ctrl.append(controls.label({
            position: Ex(20, 24, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        scroller.$content.size.y += 80;
    }

    makeButton("Save", () => {
        save();
    });

    makeButton("Hard reset", () => {
        totalDestruction();
    });


    let lerpItems = [
        [backBtn, 40],
    ]
    for (let ctrl of scroller.$content.controls) {
        let delay = (mainCanvas.height / scale - ctrl.position.y) * .5;
        if (delay > 40) lerpItems.push([ctrl, delay]);
        else break;
    }
    for (let [item, delay] of lerpItems) {
        let y = item.position.y;
        item.alpha = 0;
        setTimeout(() => tween(300, (t) => {
            let value = ease.back.out(t) ** .5;
            item.alpha = t;
            item.position.y = y + 50 * (1 - value);
        }), delay);
    }

    return menu
}