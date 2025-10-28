popups.milestones = {
    make(popup) {

        let box = controls.base({
            size: Ex(0, 0, 1, 1),
        })

        popups.prompt.make(popup, 
            "Milestones",
            box,
            [
                { icon: "arrow-left" },
            ]
        );

        return popup;
    }
}