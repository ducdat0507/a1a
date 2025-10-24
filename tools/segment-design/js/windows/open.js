windows.open = class extends AppWindow {

    /** @type {HTMLElement} */
    holder;

    style = {
        width: "24em",
        height: "36em",
    }

    constructor(elm) {
        super(elm);

        elm.$title.innerText = "Open a Design"

        this.holder = $make.section(".open-window__list.hierarchy-holder");
        elm.$content.append(this.holder);

        this.onUpdate();
    }

    onUpdate() {
        this.holder.innerText = "";

        for (let design of currentData.designs.sort((x, y) => y.lastUpdated - x.lastUpdated)) {
            
            this.holder.append(
                $make.button(
                    {
                        className: "open-window__item"
                    },
                    $make.span(".item-name", design.name),
                    $make.span(".item-time", new Date(design.lastUpdated)),
                )
            )
        }
    }

    cleanup(elm) {

    }
} 