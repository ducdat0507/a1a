panes.properties = class extends Pane {

    /** @type {HTMLElement} */
    holder;

    constructor(elm) {
        super(elm);
        this.holder = $make.section({className: "properties-pane__holder form-holder"});
        elm.append(this.holder);

        events.on("selection-update", this.onUpdate, this);
        events.on("property-update", this.onUpdate, this);

        this.onUpdate();
    }

    onUpdate(source, freq = 0) {
        if ((source == "properties" || freq < 0) && freq < 1) return;

        let elm = this.holder;
        elm.innerHTML = "";

        if (activeObjects.size == 0) {
            elm.append(
                $make.h2(null, "No object selected"),
                $make.p(null, "Select an object to view its properties."),
            );
        }
        if (activeObjects.size == 1) {
            let obj = activeObjects.values().next().value;
            
            if (obj == currentDesign) {
                elm.append(
                    form.prop("User-defined specs",
                        $make.b({ style: "width: calc(12ch + 4px)" }, "Keys"),
                        $make.b({ style: "width: calc(12ch + 4px)" }, "Values"),
                    ),
                    ...Object.keys(currentDesign.extraSpec).map((spec) => form.prop("", 
                        form.field({}, () => spec, (x) => {
                            let obj = currentDesign.extraSpec;
                            if (!x) {
                                delete obj[spec];
                                events.emit("property-update", "properties", 1);
                            } else if (spec != x) {
                                delete Object.assign(obj, {[x]: obj[spec]})[spec];
                                events.emit("property-update", "properties", 1);
                            }
                            
                        }),
                        form.field({}, () => currentDesign.extraSpec[spec], (x) => {
                            let obj = currentDesign.extraSpec;
                            Object.assign(obj, {[spec]: x});
                        }),
                    )),
                    form.prop("", 
                        form.field({}, () => "", (x) => {
                            let obj = currentDesign.extraSpec;
                            Object.assign(obj, {[x]: ""});
                            events.emit("property-update", "properties", 1);
                        }),
                    ),
                );
            } else if (obj instanceof DesignElement) {
                elm.append(
                    form.prop("Operation", 
                        form.select(
                            { 
                                [DesignElementOperation.ADD]: "Add",
                                [DesignElementOperation.SUBTRACT]: "Subtract"
                            },
                            () => obj.operation,
                            (x) => { obj.operation = x; events.emit("property-update", "properties") }
                        ),
                    )
                );
                elm.append(
                    form.prop("Stroke", 
                        form.number(
                            "u",
                            { min: 0 },
                            () => obj.stroke.thickness,
                            (x) => { obj.stroke.thickness = x; events.emit("property-update", "properties") }
                        ),
                        form.select(
                            { 
                                [PathStrokeJoin.MITER]: [$icon("lsicon:linejoin-miter-outline", { style: "font-size:16px;vertical-align:-3px" }), "Miter"],
                                [PathStrokeJoin.ROUND]: [$icon("lsicon:linejoin-round-outline", { style: "font-size:16px;vertical-align:-3px" }), "Round"],
                                [PathStrokeJoin.BEVEL]: [$icon("lsicon:linejoin-bevel-outline", { style: "font-size:16px;vertical-align:-3px" }), "Bevel"],
                            },
                            () => obj.stroke.join,
                            (x) => { obj.stroke.join = x; events.emit("property-update", "properties") }
                        ),
                        form.select(
                            { 
                                [PathStrokeCap.BUTT]:   [$icon("lsicon:linecap-butt-outline", { style: "font-size:16px;vertical-align:-3px" }), "Butt"],
                                [PathStrokeCap.ROUND]:  [$icon("lsicon:linecap-round-outline", { style: "font-size:16px;vertical-align:-3px" }), "Round"],
                                [PathStrokeCap.SQUARE]: [$icon("lsicon:linecap-square-outline", { style: "font-size:16px;vertical-align:-3px" }), "Square"],
                            },
                            () => obj.stroke.cap,
                            (x) => { obj.stroke.cap = x; events.emit("property-update", "properties") }
                        ),
                    )
                );
            } else if (obj instanceof SegmentWire) {
                elm.append(
                    form.prop("Lights", 
                        form.toggleField(
                            new Array(10).fill("").map((x, i) => form.toggle(
                                i,
                                () => obj.digits[i],
                                (x) => { obj.digits[i] = x; events.emit("property-update", "properties") }
                            )),
                        ),
                    )
                );
            }
        }
    }

    cleanup(elm) {
        events.off("selection-update", this.onUpdate);
        events.off("property-update", this.onUpdate);
    }
}
