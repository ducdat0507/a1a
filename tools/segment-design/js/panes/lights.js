panes.lights = class extends Pane {

    /** @type {HTMLElement} */
    holder;

    constructor(elm) {
        super(elm);
        this.holder = $make.section({className: "design-pane__holder"});
        elm.append(this.holder);

        events.on("selection-update", this.onUpdate, this);
        events.on("property-update", this.onUpdate, this);

        this.onUpdate();
    }

    onUpdate(source, freq = 0) {
        if (source == "design" || freq < 0) return;

        let elm = this.holder;
        elm.innerHTML = "";

        // TODO add lights
    }

    cleanup(elm) {
        events.off("selection-update", this.onUpdate);
        events.off("property-update", this.onUpdate);
    }

}