menus.main = () => {

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
    })

    let machBtn = controls.button({
        position: Ex(0, -500, 0, 0),
        size: Ex(-10, 200, 0.5, 0),
        mask: true,
        fill: "#ef5340",
        radius: 20,
    })
    menu.append(machBtn, "machBtn");

    machBtn.append(controls.icon({
        position: Ex(-50, -50, 1, 1),
        scale: 250,
        icon: "progress-down",
        fill: "#0003",
    }), "icon")

    machBtn.append(controls.label({
        position: Ex(18, 20, 0, 0),
        scale: 32,
        align: "left",
        text: "Machines",
    }), "title")



    let custBtn = controls.button({
        position: Ex(10, -500, 0.5, 0),
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


    let footer = controls.base({
        position: Ex(0, -100, 0, 0),
        size: Ex(0, 60, 1, 0),
    })
    menu.append(footer, "footer")

    footer.append(controls.label({
        position: Ex(10, 13, 0, 0),
        scale: 16,
        align: "left",
        weight: 300,
        fill: "#fff4",
        text: "A+1→A",
    }))

    footer.append(controls.label({
        position: Ex(10, 32, 0, 0),
        scale: 16,
        align: "left",
        weight: 300,
        fill: "#fff4",
        text: "a thing by duducat",
    }))

    let optBtn = controls.button({
        position: Ex(-60, 0, 1, 0),
        size: Ex(60, 60, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 30,
    })
    footer.append(optBtn, "optBtn");

    optBtn.append(controls.icon({
        position: Ex(0, 0, .5, .5),
        scale: 32,
        icon: "settings",
    }), "icon")



    let storeBtn = controls.button({
        position: Ex(0, -280, 0, 0),
        size: Ex(0, 100, 1, 0),
        mask: true,
        fill: "#7c6aff",
        radius: 20,
    })
    menu.append(storeBtn, "storeBtn");

    storeBtn.append(controls.icon({
        position: Ex(-50, -50, 1, 1),
        scale: 150,
        icon: "shopping-cart",
        fill: "#0003",
    }), "icon")

    storeBtn.append(controls.label({
        position: Ex(18, 20, 0, 0),
        scale: 32,
        align: "left",
        text: "Store",
    }), "title")



    let lerpItems = [
        [machBtn, 160],
        [custBtn, 160],
        [storeBtn, 80],
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