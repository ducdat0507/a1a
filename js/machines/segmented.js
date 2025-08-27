machines.segmented = {
    prefs: {
        design: {
            name: "Display Designs",
            icon: "numbers",
            items: () => data.machines.segmented.designs,
            makeItems(body, items) {
                const itemsPerRow = 4;
                const itemGap = 10;
                const itemHeight = 150;
                const startPos = body.size.y;

                let index = 0;
                for (let id in items) {
                    let item = items[id];

                    let button = controls.button({
                        position: Ex(
                            itemGap * (index % itemsPerRow) / itemsPerRow,
                            startPos + Math.floor(index / itemsPerRow) * (itemHeight + itemGap), 
                            (index % itemsPerRow) / itemsPerRow,
                            0
                        ),
                        size: Ex(
                            -itemGap * (itemsPerRow - 1) / itemsPerRow,
                            itemHeight,
                            1 / itemsPerRow,
                            0,
                        ),
                        fill: "#3f3f3f",
                        radius: 15,
                        mask: true,
                        onClick() {
                            getCurrentMachine().prefs.design = id;
                            try {
                                scene.$machine.$body.$value.design = item;
                            } catch (e) {

                            }
                        }
                    });
                    button.append(controls.counter({
                        position: Ex(0, 0, 0.6, 0.4),
                        scale: 80,
                        fillSub: "#fff3",
                        design: item,
                        value: 42,
                    }));
                    body.append(button);
                    
                    index++;
                }

                body.size.y += Math.ceil(index / itemsPerRow) * (itemHeight + itemGap) - itemGap;
            }
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