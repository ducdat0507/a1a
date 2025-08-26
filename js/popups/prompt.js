popups.prompt = {
    make(popup, title, body, options, onAnswer = null) {
        popup.$title.$label.text = title;

        if (typeof body == "string") {
            let box = controls.rect({
                size: Ex(0, 0, 1, 1),
                fill: "#1f1f1f",
                radius: 40,
            })
            box.append(controls.label({
                position: Ex(0, 54, 0.5, 0),
                size: Ex(-80, -60, 1, 1),
                scale: 24,
                text: body,
                wrap: true,
            }))
            popup.$body.append(box);
        }

        const itemWidth = 80;
        const itemGap = 10;

        let index = 0;
        for (const item of options) {
            let button = controls.button({
                position: Ex(
                    item.right 
                        ? (itemWidth + itemGap) * (index - options.length) + itemGap
                        : (itemWidth + itemGap) * index,
                    0,
                    item.right ? 1 : 0,
                    0
                ),
                size: Ex(80, 80),
                radius: 40,
                fill: "#3f3f3f",
                onClick() {
                    if (!onAnswer?.(item.id ?? item.icon)) popup.close();
                }
            })
            button.append(controls.icon({
                position: Ex(0, 0, .5, .5),
                scale: 40,
                icon: item.icon,
            }), "icon")

            popup.$actions.append(button);
            index++;
        }

        return popup;
    }
}