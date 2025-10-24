panes.design = class extends Pane {

    /** @type {HTMLElement} */
    holder;

    constructor(elm) {
        super(elm);
        this.holder = $make.section(".design-pane__holder.hierarchy-holder");
        elm.append(this.holder);

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

        elm.append($make.button({
            ariaSelected: activeObjects.has(currentDesign),
            "on:click": () => {
                activeObjects.clear();
                activeObjects.add(currentDesign);
                events.emit("selection-update");
            }
        }, $icon("lucide:map"), "Specs"))

        for (let item of currentDesign.design) {
            elm.append($make.button({
                ariaSelected: activeObjects.has(item),
                "on:click": () => {
                    activeObjects.clear();
                    activeObjects.add(item);
                    events.emit("selection-update");
                }
            }, $icon(["tabler:minus", "", "tabler:plus"][+item.operation + 1]), item.toString()))
        }
    }

    cleanup(elm) {
        events.off("selection-update", this.onUpdate);
        events.off("property-update", this.onUpdate);
    }

}