popups.text = {
    make(popup, path, title) {

        let box = controls.rect({
            size: Ex(0, 0, 1, 1),
            fill: "#1f1f1f",
            radius: 40,
        })

        let scroller = controls.scroller({
            size: Ex(0, 0, 1, 1),
        })
        box.append(scroller)
        
        let label = controls.label({
            position: Ex(40, 54, 0, 0),
            size: Ex(-80, -60, 1, 1),
            scale: 24,
            align: "left",
            text: "Loading...",
            wrap: true,
            onTextReflow() {
                scroller.$content.size.y = label.lines.length * label.scale * 1.3 + 80
            }
        })
        scroller.$content.append(label)

        popups.prompt.make(popup, 
            title,
            box,
            [
                { icon: "arrow-left" },
            ]
        );

        let request = fetch(path).then(x => x.text()).then(x => {
            label.text = x.replaceAll(/([^ \r\n])\r?\n([^\r\n])/gm, "$1 $2").trim()
        })

        return popup;
    }
}