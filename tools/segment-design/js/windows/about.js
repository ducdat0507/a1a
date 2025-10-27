windows.about = class extends AppWindow {

    /** @type {HTMLElement} */
    window;

    style = {
        width: "32em",
        maxHeight: "50em",
    }

    constructor(elm) {
        super(elm);
        this.window = elm;

        elm.$title.innerText = "About"

        elm.$content.innerHTML = `
        
        `
        
        this.actions = $make.div(".action-holder",
            form.button("Close", () => elm.$close.click()),
        );
        elm.$content.append(this.actions);
    }


    cleanup(elm) {

    }
} 