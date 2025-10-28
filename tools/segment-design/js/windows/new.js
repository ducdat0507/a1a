windows.new = class extends AppWindow {

    /** @type {HTMLElement} */
    window;

    data = {
        name: "New design"
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
            )
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