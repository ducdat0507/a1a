machines.segmented = {
    unlocks: {
        prefs: {
            design: new Set(["basic7_1", "basic7_2"]),
            colors: {
                body: new Set(),
                display: new Set(),
                button1st: new Set(),
                button2nd: new Set(),
            },
            specs: {
                contrast: new Set([0]),
                switchFromTime: new Set([0]),
                switchToTime: new Set([0]),
                switchThreshold: new Set([0]),
            },
        },
        items: {},
    },
    prefs: {
        design: {
            name: "Display Designs",
            icon: "numbers",
            items: () => data.machines.segmented.designs,

            gachaCost: [50, 2],
            circleFactor: 1,

            makeItems(body, items) {
                const itemsPerRow = 4;
                const itemGap = 10;
                const itemHeight = 160;
                const startPos = body.size.y;

                let index = 0;
                let itemIds = Object.keys(items).sort((x, y) => items[x].worth - items[y].worth);
                for (const id of itemIds) {
                    let item = items[id];
                    items[id].index = index;

                    let button = this.makeItem(id, item);
                    button.onClick = () => {
                        getCurrentMachine().prefs.design = id;
                        body._updateStatus();
                        save();
                        try {
                            scene.$machine.$body.$value.design = item;
                        } catch (e) {}
                    }
                    button.position = Ex(
                        itemGap * (index % itemsPerRow) / itemsPerRow,
                        startPos + Math.floor(index / itemsPerRow) * (itemHeight + itemGap), 
                        (index % itemsPerRow) / itemsPerRow,
                        0
                    ),
                    button.size = Ex(
                        -itemGap * (itemsPerRow - 1) / itemsPerRow,
                        itemHeight,
                        1 / itemsPerRow,
                        0,
                    ),
                    button._updateStatus();
                    body.append(button);
                    
                    index++;
                }

                body.size.y += Math.ceil(index / itemsPerRow) * (itemHeight + itemGap) - itemGap;

                body._updateStatus = () => {
                    for (let button of body.controls) button._updateStatus();
                }
            },

            makeItem(id, item) {
                let button = controls.button({
                    fill: "#3f3f3f",
                    radius: 15,
                    mask: true,
                });
                button.append(controls.counter({
                    position: Ex(-15, 60, 1, 0),
                    scale: 80,
                    fillSub: "#fff3",
                    design: item,
                    align: 0,
                    digits: 2,
                    value: item.index + 1,
                    bloom: false,
                }));
                button.append(controls.rect({
                    position: Ex(0, -40, 0, 1),
                    size: Ex(0, 40, 1, 0),
                    fill: "#0007",
                }), "footer");
                button.append(controls.label({
                    position: Ex(10, -20, 0, 1),
                    scale: 20,
                    align: "left",
                    font: "tabler icons",
                    fill: "#0007",
                }), "status");

                button._updateStatus = () => {
                    let unlocks = gameData.unlocks.segmented;
                    let unlocked = unlocks.prefs.design.has(id);
                    button.alpha = unlocked ? 1 : 0.2;
                    if (unlocked) {
                        let equipped = getCurrentMachine().prefs.design == id;
                        button.clickthrough = equipped;
                        button.fill = equipped ? "#9f57" : "#3f3f3f";
                        button.$footer.fill = equipped ? "#9f5" : "#0007";
                        button.$status.fill = equipped ? "#000" : "#9f5";
                        button.$status.text = equipped 
                            ? iconsets.tabler.charmap["check"] 
                            : iconsets.tabler.charmap["square-rotated"].repeat(item.worth);
                    } else {
                        button.fill = "#7f7f7f";
                        button.clickthrough = true;
                        button.$footer.fill = "#3f3f3f";
                        button.$status.fill = "#9f5";
                        button.$status.text = iconsets.tabler.charmap["square-rotated-filled"].repeat(item.worth);
                    }
                }

                return button;
            }
        },
        colors: {
            name: "Colors",
            icon: "palette",
            unlocked: () => gameData.unlocks.segmented.items.colors > 0,
            items: () => data.machines.segmented.colors,

            gachaCost: [50, 1],
            circleFactor: 1,
            makeItems(body, items) {
                // TODO implement this
            },
            makeItem(id, item) {
                // TODO implement this
            }
        },
        specs: {
            name: "Specifications",
            icon: "adjustments-alt",
            unlocked: () => gameData.unlocks.segmented.items.specs > 0,
            items: () => data.machines.segmented.specs,

            gachaCost: [50, 1],
            circleFactor: 1,
            makeItems(body, items) {
                // TODO implement this
            },
            makeItem(id, item) {
                // TODO implement this
            }
        },
    },
    shop: {
        items: {
            squareBoost: {
                name: "Gain more " + iconsets.tabler.charmap["square-rotated"],
                category: "Boosts",
                icon: "square-rotated-filled",
                effects: [0, 1, 2, 3, 5, 7, 10, 13, 16, 20, 25, 30, 36, 42, 50, 60, 72],
                effectDisplay(x) { return `+${this.effects[x]} / 1k`; },
                costs: [1, 2, 4, 7, 10, 16, 25, 36, 50, 72, 100, 140, 200, 300, 500, 800],
                costType: "circle",
            },
            designColor: {
                name: "Unlock Colors",
                category: "Customization",
                icon: "palette",
                effects: [
                    "Unlock Body colors",
                    "Unlock Display colors",
                    "Unlock Button colors",
                    "All colors unlocked!",
                ],
                effectDisplay(x) { return this.effects[x] },
                effectType: "single",
                costs: [2, 3, 3],
                costType: "pent",
            },
            designSpec: {
                name: "Unlock Specifications",
                category: "Customization",
                icon: "adjustments-alt",
                effects: [
                    "Unlock Display contrasts",
                    "Unlock Display transition thresholds",
                    "Unlock Display transition times",
                    "All specifications unlocked!",
                ],
                effectDisplay(x) { return this.effects[x] },
                effectType: "single",
                costs: [1, 2, 2],
                costType: "pent",
            },
        }
    },
    setup(body, machine) {
        body.append(controls.label({
            position: Ex(0, -200, 0.5, 0.5),
            size: Ex(0, 0),
            text: "A =",
            scale: 16,
            fill: "#8f8f8f",
        }), "label");

        body.append(controls.rect({
            position: Ex(20, -160, 0, 0.5),
            size: Ex(-40, 200, 1, 0),
            radius: 10,
            fill: "#000000",
        }), "valueBackground");

        body.append(controls.counter({
            position: Ex(0, -60, 0.5, 0.5),
            size: Ex(0, 0, 0, 0),
            scale: 120,
            digits: 6,
            fill: "#ffffff",
            design: data.machines.segmented.designs[machine.prefs.design]
        }), "value");

        body.setValue = (value) => {
            body.$value.value = gameData.number;
        }
    }
}