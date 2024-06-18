machines.segmented = (body) => {
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
        scale: 150,
        digits: 6,
        fill: "#ffffff",
    }), "value");

    body.setValue = (value) => {
        body.$value.value = gameData.number;
    }
}