let popups = {}

function callPopup(name, ...args) {
    let popup = controls.rect({
        size: Ex(0, 0, 1, 1)
    })

    popup.append(controls.rect({
        position: Ex(20, -50),
        size: Ex(-40, 130, 1, 0),
        fill: "#2f2f2f",
        radius: 30,
    }), "title")
    popup.$title.append(controls.label({
        position: Ex(25, 92),
        align: "left",
        style: "700",
        scale: 32,
    }), "label")

    popup.append(menuHolder = controls.base({
        position: Ex(-280, 100, 0.5, 0),
        size: Ex(560, -220, 0, 1),
    }), "body");

    popup.append(menuHolder = controls.base({
        position: Ex(-280, -100, 0.5, 1),
        size: Ex(560, 80),
    }), "actions");


    popup.close = () => {
        for (let ctl of popup.controls) ctl.clickthrough = true;
        tween(300, (t) => {
            let value = ease.cubic.out(t);
            popup.fill = "#000000" + Math.round((1 - value) * 192).toString(16).padStart(2, "0");
            popup.$title.position.y = -50 - 80 * value;
            popup.$body.alpha = popup.$actions.alpha = 1 - value;
            
            let value2 = ease.cubic.in(t);
            popup.$body.position.y = 100 + 100 * value2;
            popup.$actions.position.y = -100 + 100 * value2;
        }).then(() => {
            scene.remove(popup);
        })
    }
    popups[name].make(popup, ...args);
    scene.append(popup);

    doItemReveal([
        [popup.$body, 50],
        [popup.$actions, 100],
    ])
    tween(500, (t) => {
        let value = ease.quint.out(t);
        popup.fill = "#000000" + Math.round(value * 192).toString(16).padStart(2, "0");

        let value2 = ease.back.out(t);
        popup.$title.position.y = -130 + 80 * value2;
    })

    return popup;
}