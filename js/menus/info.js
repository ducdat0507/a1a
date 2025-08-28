menus.info = (openMenu, closeMenu) => {

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Information",
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

    let scroller = controls.scroller({
        size: Ex(0, 0, 1, 1),
        mask: true,
    })
    box.append(scroller);

    forms.beginForms(scroller);

    scroller.$content.append(controls.label({
        position: Ex(0, scroller.$content.size.y + 50, 0.5, 0),
        scale: 72,
        style: "700",
        label: "A+1→A"
    }))

    scroller.$content.size.y += 100;

    forms.makeText("a fidget clicker thingy");

    forms.doneForms();


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