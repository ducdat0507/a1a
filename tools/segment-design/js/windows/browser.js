windows.browser = class extends AppWindow {

    /** @type {HTMLElement} */
    window;
    /** @type {HTMLElement} */
    holder;
    /** @type {HTMLElement} */
    actions;
    /** @type {HTMLButtonElement[]} */
    actionButtons = [];

    selectedDesign = "";

    style = {
        width: "30em",
        height: "36em",
        resize: "both",
    }
    static unique = true;

    constructor(elm) {
        super(elm);
        this.window = elm;

        elm.$title.innerText = "Design Browser"

        elm.$content.append($make.h4({}, "Select a Design:"));
        this.holder = $make.section(".browser-window__list.hierarchy-holder");
        elm.$content.append(this.holder);
        
        this.actions = $make.div(".browser-window__actions",
            form.button("New Design"),
            $make.span({style: "flex: 1"}),
            this.actionButtons[0] = form.button("Delete", () => this.deleteDesign(this.selectedDesign)),
            this.actionButtons[1] = form.button("Open Design", () => this.openDesign(this.selectedDesign)),
        );
        elm.$content.append(this.actions);

        console.log(this.actionButtons);

        this.actionButtons.forEach(x => x.querySelectorAll("button").forEach(y => y.disabled = true));

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
        this.actionButtons.forEach(x => x.querySelectorAll("button").forEach(y => y.disabled = false));
        this.onUpdate();
        console.log(this.selectedDesign);
    }

    openDesign(id) {
        setDesign(id);
        this.window.$close.click();
    }


    cleanup(elm) {

    }
} 