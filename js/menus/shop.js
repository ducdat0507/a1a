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

    function makeShopButton(machine, item) {
        let data = machines[machine].shop.items[item];

        let ctrl;
        scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, data.effectDisplay ? 190 : 140, 1, 0),
            fill: "#2f2f2f",
            radius: 20
        }))

        ctrl.append(controls.icon({
            position: Ex(-50, -50, 1, 1),
            scale: 250,
            icon: data.icon,
            fill: "#0003",
        }), "icon")
        ctrl.append(controls.label({
            position: Ex(25, 40, 0, 0),
            scale: 28,
            align: "left",
            text: data.name,
        }), "title")
        ctrl.append(controls.label({
            position: Ex(25, 78, 0, 0),
            scale: 24,
            align: "left",
            fill: "#bbb",
            text: "",
        }), "effect")

        ctrl.append(controls.label({
            position: Ex(-134, -52, 1, 1),
            scale: 24,
            align: "right",
            text: "",
        }), "costLabel")
        ctrl.append(controls.icon({
            position: Ex(-110, -54, 1, 1),
            scale: 32,
            icon: {
                square: "square-rotated-filled",
                pent: "pentagon-filled",
                hex: "hexagon-filled",
                circle: "circle-filled",
            }[data.costType],
            fill: {
                square: "#9f5",
                pent: "#bbf",
                hex: "#fbb",
                circle: "#fff",
            }[data.costType]
        }), "costIcon")


        ctrl.append(controls.button({
            position: Ex(-80, -80, 1, 1),
            size: Ex(70, 70),
            fill: "#3f5f3f",
            radius: 10,
            onClick: () => buyItem(machine, item, () => {
                update();
                updateResBox();
            })
        }), "buyBtn")
        ctrl.$buyBtn.append(controls.icon({
            position: Ex(0, 0, 0.5, 0.5),
            scale: 40,
            icon: "shopping-cart",
        }), "icon")

        if (data.costs.length > 1) {
            let tickSize = Math.min(80, 440 / (data.costs.length + 2) - 2);
            ctrl.append(controls.base({
                position: Ex(-95 - tickSize, -22, 1, 1),
            }), "ticks")
            for (let a = 0; a < data.costs.length; a++) {
                ctrl.$ticks.prepend(controls.rect({
                    position: Ex(-(tickSize + 2) * a, -8, 0, 0),
                    size: Ex(tickSize, 10),
                    radius: 2,
                    fill: "#fff"
                }), "ticks")
            }
        }

        function update() {
            let amount = gameData.unlocks[machine].items[item] ?? 0;
            let cost = data.costs[amount];
            let canAfford = getCurrency(data.costType) >= cost;
            if (amount < data.costs.length) {
                ctrl.$effect.text = data.effectDisplay
                    ? (
                        data.effectType == "single"     
                            ? data.effectDisplay(amount)
                            : data.effectDisplay(amount) + "  =>  " + data.effectDisplay(amount + 1)
                    ) : "";
                ctrl.$buyBtn.alpha = canAfford ? 1 : 0.5;
                ctrl.$buyBtn.clickthrough = !canAfford;
                ctrl.$costLabel.text = formatFixed(cost);
            } else {
                ctrl.$effect.text = data.effectDisplay(amount);
                ctrl.$buyBtn.alpha = 0.5;
                ctrl.$buyBtn.clickthrough = true;
                ctrl.$costLabel.text = "MAX";
            }
            if (ctrl.$ticks) for (let a = 0; a < ctrl.$ticks.controls.length; a++) {
                ctrl.$ticks.controls[a].fill = a < amount ? "#fff" : "#0f0f0f";
            }
        }
        update();

        scroller.$content.size.y += ctrl.size.y + 10;
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
        fill: "#bbf",
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

    let currentCategory = "";
    forms.beginForms(scroller);
    for (let item in machines[machine.type].shop?.items) 
    {
        let data = machines[machine.type].shop.items[item];
        if (currentCategory != data.category) {
            forms.makeHeader(data.category);
            currentCategory = data.category;
        }
        makeShopButton(machine.type, item);
    }

    scroller.$content.size.y += 40;
    forms.makeHeader("Monetary support?");
    let donate = forms.makeButton("donate button", () => open("https://liberapay.com/ducdat0507", "_blank"), "currency-dollar");
    donate.fill = "#552";

    forms.doneForms();



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