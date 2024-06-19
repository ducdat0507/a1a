menus.main = (openMenu, closeMenu) => {

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
    })

    let machBtn = controls.button({
        position: Ex(0, -460, 0, 1),
        size: Ex(-10, 200, 0.5, 0),
        mask: true,
        fill: "#ef5340",
        radius: 20,
    })
    menu.append(machBtn, "machBtn");

    machBtn.append(controls.icon({
        position: Ex(-50, -50, 1, 1),
        scale: 250,
        icon: "command",
        fill: "#0003",
    }), "icon")

    machBtn.append(controls.label({
        position: Ex(18, 20, 0, 0),
        scale: 32,
        align: "left",
        text: "Machines",
    }), "title")



    let custBtn = controls.button({
        position: Ex(10, -460, 0.5, 1),
        size: Ex(-10, 200, 0.5, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 20,
    })
    menu.append(custBtn, "custBtn");

    custBtn.append(controls.icon({
        position: Ex(-50, -50, 1, 1),
        scale: 250,
        icon: "brush",
        fill: "#0003",
    }), "icon")

    custBtn.append(controls.label({
        position: Ex(18, 20, 0, 0),
        scale: 32,
        align: "left",
        text: "Customize",
    }), "title")



    let storeBtn = controls.button({
        position: Ex(0, -240, 0, 1),
        size: Ex(0, 120, 1, 0),
        mask: true,
        fill: "#7c6aff",
        radius: 20,
    })
    menu.append(storeBtn, "storeBtn");

    storeBtn.append(controls.icon({
        position: Ex(-75, -25, 1, 1),
        scale: 250,
        icon: "shopping-cart",
        fill: "#0003",
    }), "icon")

    storeBtn.append(controls.label({
        position: Ex(18, 20, 0, 0),
        scale: 32,
        align: "left",
        text: "Store",
    }), "title")



    let footer = controls.base({
        position: Ex(0, -80, 0, 1),
        size: Ex(0, 80, 1, 0),
    })
    menu.append(footer, "footer")

    footer.append(controls.label({
        position: Ex(20, 23, 0, 0),
        scale: 16,
        align: "left",
        style: "300",
        fill: "#fff4",
        text: "A+1→A",
    }))

    footer.append(controls.label({
        position: Ex(20, 42, 0, 0),
        scale: 16,
        align: "left",
        style: "300",
        fill: "#fff4",
        text: "a thing by duducat",
    }))

    let optBtn = controls.button({
        position: Ex(-80, 0, 1, 0),
        size: Ex(80, 80, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 40,
        onclick: () => openMenu("settings"),
    })
    footer.append(optBtn, "optBtn");

    optBtn.append(controls.icon({
        position: Ex(0, 0, .5, .5),
        scale: 40,
        icon: "settings",
    }), "icon")



    let lerpItems = [
        [machBtn, 200],
        [custBtn, 200],
        [storeBtn, 120],
        [footer, 40],
    ]
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