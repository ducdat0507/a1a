panes.lights = class extends Pane {

    /** @type {HTMLElement} */
    controls;
    /** @type {HTMLElement} */
    holder;

    constructor(elm) {
        super(elm);
        this.controls = $make.div({className: "design-pane__controls"},
            form.select(
                Object.fromEntries(new Array(10).fill("").map((x, i) => [i, i])),
                () => previewNumber,
                (x) => { previewNumber = x; updateCanvas(); }
            )
        )
        this.holder = $make.section({className: "design-pane__holder hierarchy-holder"});
        elm.append(this.controls, this.holder);

        events.on("selection-update", this.onUpdate, this);
        events.on("property-update", this.onUpdate, this);

        activeObjects.clear();
        setTimeout(() => events.emit("selection-update"));

        this.onUpdate();
    }

    onUpdate(source, freq = 0) {
        if (source == "design" || freq < 0) return;

        let elm = this.holder;
        elm.innerHTML = "";

        for (let item of currentDesign.wires) {
            elm.append($make.button({
                ariaSelected: activeObjects.has(item),
                "on:click": () => {
                    activeObjects.clear();
                    activeObjects.add(item);
                    events.emit("selection-update");
                }
            },
                $icon("lucide:lightbulb"),
                "Light (",
                $make.code({}, item.digits.map((x, i) => x ? i : ".").join("")),
                ")"
            ))
        }
    }

    cleanup(elm) {
        events.off("selection-update", this.onUpdate);
        events.off("property-update", this.onUpdate);
    }

}