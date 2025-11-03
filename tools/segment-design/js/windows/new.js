windows.new = class extends AppWindow {

    /** @type {HTMLElement} */
    window;

    data = {
        name: "New design",
        template: "none",
    }

    style = {
        width: "30em",
    }
    static unique = true;

    constructor(elm) {
        super(elm);
        this.window = elm;

        elm.$title.innerText = "New Design"


        elm.$content.append(
            $make.div(".form-holder",
                form.prop("Name",
                    form.field({}, () => this.data.name, (x) => this.data.name = x)
                ),
            ),
            $make.div(".form-holder",
                form.prop("Template",
                    form.select({
                        "none": "None",
                        "square": "Square",
                        "circle": "Circle",
                        "bevel": "Bevel",
                    }, () => this.data.template, (x) => this.data.template = x)
                ),
            ),
        );
        
        this.actions = $make.div(".action-holder",
            form.button("Cancel", () => this.window.$close.click()),
            $make.span({style: "flex: 1"}),
            form.button("Create", () => this.createDesign()),
        );
        elm.$content.append(this.actions);
    }

    createDesign() {
        let design =  {
            id: crypto.randomUUID(),
            name: this.data.name,
            lastUpdated: Date.now(),
            design: newDesign()
        };

        switch (this.data.template) 
        {
            case "square":
                design.design.design.push(
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(0, 0) },
                            { center: Vector2(48, 0) },
                            { center: Vector2(48, 120) },
                            { center: Vector2(0, 120) },
                        ],
                        operation: DesignElementOperation.ADD,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 12) },
                            { center: Vector2(36, 12) },
                            { center: Vector2(36, 54) },
                            { center: Vector2(12, 54) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 66) },
                            { center: Vector2(36, 66) },
                            { center: Vector2(36, 108) },
                            { center: Vector2(12, 108) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                )
                break;
            case "circle":
                design.design.design.push(
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(0, 8) },
                            { center: Vector2(8, 0), bezierP1: Vector2(0, 4), bezierP2: Vector2(4, 0) },
                            { center: Vector2(40, 0) },
                            { center: Vector2(48, 8), bezierP1: Vector2(44, 0), bezierP2: Vector2(48, 4) },
                            { center: Vector2(48, 112) },
                            { center: Vector2(40, 120), bezierP1: Vector2(48, 116), bezierP2: Vector2(44, 120) },
                            { center: Vector2(8, 120) },
                            { center: Vector2(0, 112), bezierP1: Vector2(4, 120), bezierP2: Vector2(0, 116) },
                        ],
                        operation: DesignElementOperation.ADD,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 12) },
                            { center: Vector2(36, 12) },
                            { center: Vector2(36, 54) },
                            { center: Vector2(12, 54) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 66) },
                            { center: Vector2(36, 66) },
                            { center: Vector2(36, 108) },
                            { center: Vector2(12, 108) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                )
                break;
            case "bevel":
                design.design.design.push(
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(0, 8) },
                            { center: Vector2(8, 0) },
                            { center: Vector2(40, 0) },
                            { center: Vector2(48, 8) },
                            { center: Vector2(48, 112) },
                            { center: Vector2(40, 120) },
                            { center: Vector2(8, 120) },
                            { center: Vector2(0, 112) },
                        ],
                        operation: DesignElementOperation.ADD,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 12) },
                            { center: Vector2(36, 12) },
                            { center: Vector2(36, 54) },
                            { center: Vector2(12, 54) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                    new PathDesignElement({
                        nodes: [
                            { center: Vector2(12, 66) },
                            { center: Vector2(36, 66) },
                            { center: Vector2(36, 108) },
                            { center: Vector2(12, 108) },
                        ],
                        operation: DesignElementOperation.SUBTRACT,
                        mayClose: true,
                    }),
                )
                break;
        }

        currentData.designs.push(design);
        setDesign(design.id);
        events.emit("selection-update");
        save();

        this.window.$close.click();
    }

    cleanup(elm) {

    }
} 