windows.browser = class extends AppWindow {

    /** @type {HTMLElement} */
    window;
    /** @type {HTMLElement} */
    holder;
    /** @type {HTMLElement} */
    details;
    /** @type {HTMLElement} */
    actions;
    /** @type {HTMLButtonElement[]} */
    actionButtons = [];

    selectedDesign = "";

    style = {
        width: "52em",
        height: "32em",
        resize: "both",
    }
    static unique = true;

    constructor(elm) {
        super(elm);
        this.window = elm;

        elm.$title.innerText = "Design Browser"

        elm.$content.append(
            $make.h4({}, "Select a Design:"),
            $make.div({ style: "display: flex; flex: 1; flex-flow: row; gap: 0.5em" },
                this.holder = $make.section(".browser-window__list.hierarchy-holder"),
                this.details = $make.section(".browser-window__details")
            )
        );
        
        this.actions = $make.div(".action-holder",
            form.button("New Design"),
            $make.span({style: "flex: 1"}),
            this.actionButtons[0] = form.buttonGroup(
                ["Rename", (e) => this.renameDesign(this.selectedDesign, e)],
                ["Duplicate", (e) => this.duplicateDesign(this.selectedDesign, e)],
                ["Delete", (e) => this.deleteDesign(this.selectedDesign, e)],
            ),
            this.actionButtons[1] = form.button("Load Design", () => this.openDesign(this.selectedDesign)),
        );
        elm.$content.append(this.actions);

        this.setButtonsEnabled(false);

        this.onUpdate();
    }

    onUpdate() {
        this.holder.innerText = "";

        let now = Date.now();

        for (const design of currentData.designs.sort((x, y) => y.lastUpdated - x.lastUpdated)) {
            
            this.holder.append(
                $make.button({
                    className: "file",
                    ariaSelected: this.selectedDesign == design.id,
                    "on:click": () => this.setDesign(design),
                    "on:dblclick": () => this.openDesign(design.id),
                },
                    $make.span("",
                        $make.b(".item-name", design.name),
                        ...(design.id == currentData.currentDesign ? ["\t", $make.span("", "(Active)")] : []),
                    ),
                    $make.span("",
                        $make.time(".item-time", format.past(now - design.lastUpdated)),
                    ),
                )
            )
        }
    }

    setDesign(design) {
        this.selectedDesign = design.id;
        this.setButtonsEnabled(true);
        this.onUpdate();
        console.log(this.selectedDesign);
    }

    openDesign(id) {
        setDesign(id);
        this.window.$close.click();
    }

    deleteDesign(id, e) {
        spawnWindow("prompt", e, {
            title: "Delete Design?",
            icon: "ph:warning-thin",
            content: $make.div("", 
                $make.p("", "Are you sure you want to delete this design?"),
                $make.p("", "This can not be undone!")
            ),
            actions: [
                ["Cancel", () => null],
                null,
                ["Delete", () => {
                    currentData.designs = currentData.designs.filter(x => x.id != id);
                    save();
                    this.onUpdate();
                }]
            ]
        })
    }

    duplicateDesign(id, e) {
        let design = currentData.designs.find(x => x.id == id);
        let name = design.name + " (duplicated)"
        spawnWindow("prompt", e, {
            title: "Duplicate Design",
            icon: "ph:info-thin",
            content: $make.div("", 
                $make.p("", "Enter the name of the newly duplicated design:"),
                form.field({}, () => name, (x) => name = x)
            ),
            actions: [
                ["Cancel", () => null],
                null,
                ["Duplicate", () => {
                    currentData.designs.push({
                        id: crypto.randomUUID(),
                        name,
                        design: JSON.parse(JSON.stringify(design.design)),
                        lastUpdated: Date.now(),
                    });
                    save();
                    this.onUpdate();
                }]
            ]
        })
    }

    renameDesign(id, e) {
        let design = currentData.designs.find(x => x.id == id);
        let name = design.name
        spawnWindow("prompt", e, {
            title: "Rename Design",
            icon: "ph:info-thin",
            content: $make.div("", 
                $make.p("", "Enter the name of this design:"),
                form.field({}, () => name, (x) => name = x)
            ),
            actions: [
                ["Cancel", () => null],
                null,
                ["Rename", () => {
                    design.name = name;
                    save();
                    this.onUpdate();
                }]
            ]
        })
    }


    setButtonsEnabled(enabled) {
        const disabled = !enabled;
        this.actionButtons.forEach(x => x.querySelectorAll("button").forEach(y => y.disabled = disabled));
    }



    cleanup(elm) {

    }
} 