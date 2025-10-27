windows.prompt = class extends AppWindow {

    /** @type {HTMLElement} */
    window;

    style = {
        minWidth: "32em",
        maxWidth: "50em",
    }

    constructor(elm, args) {
        super(elm);
        this.window = elm;

        elm.$title.innerText = args.title

        elm.$content.append(
            $make.div(".prompt-window__holder",
                args.icon ? $icon(args.icon) : "",
                $make.section(".prompt-window__content", args.content)
            )
        );
        
        this.actions = $make.div(".action-holder",
            ...args.actions.map(x => {
                if (!x) return $make.div({ style: "flex: 1"});
                return form.button(x[0], (e) => {
                    if (!x[1](e)) elm.$close.click();
                })
            })
        );
        elm.$content.append(this.actions);
    }


    cleanup(elm) {

    }
} 