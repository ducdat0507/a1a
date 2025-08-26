menus.settings = (openMenu, closeMenu) => {

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Settings",
    }, "box")
    
    let backBtn = controls.button({
        position: Ex(0, -80, 0, 1),
        size: Ex(80, 80, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 40,
        onClick: () => closeMenu(),
    })
    menu.append(backBtn, "backBtn");

    backBtn.append(controls.icon({
        position: Ex(0, 0, .5, .5),
        scale: 40,
        icon: "arrow-left",
    }), "icon")


    let box = controls.rect({
        position: Ex(0, 80),
        size: Ex(0, -180, 1, 1),
        fill: "#0000",
        radius: 40,
        mask: true,
    })
    menu.append(box, "box");

    let scroller = controls.scroller({
        size: Ex(0, 0, 1, 1),
        mask: true,
    })
    box.append(scroller);

    function makeHeader(title) {
        let ctrl;
        scroller.$content.append(ctrl = controls.label({
            position: Ex(1, scroller.$content.size.y + 55, 0, 0),
            scale: 32,
            style: "700",
            align: "left",
            text: title,
        }));

        scroller.$content.size.y += 90;
        return ctrl;
    }

    function makeText(content, lines) {
        let ctrl;

        scroller.$content.append(ctrl = controls.label({
            position: Ex(0, scroller.$content.size.y + 18, 0, 0),
            size: Ex(0, 0, 1, 0),
            scale: 24,
            align: "left",
            text: content,
            fill: "#fffa",
            wrap: true,
        }))

        scroller.$content.size.y += 24 * 1.3 * lines + 20;
        return ctrl;
    }

    function makeButton(title, onClick, icon = null) {
        let ctrl;
        scroller.$content.append(ctrl = controls.button({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#3f3f3f",
            radius: 20,
            onClick
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        if (icon) {
            ctrl.append(controls.icon({
                position: Ex(-40, 40, 1, 0),
                scale: 40,
                icon
            }), "icon")
        }

        scroller.$content.size.y += 90;
        return ctrl;
    }

    function makeCheckbox(title, getValue, onChange) {
        let ctrl;
        scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#1f1f1f",
            radius: 20,
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        ctrl.append(controls.button({
            position: Ex(-70, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(!ctrl.$check.$icon, update);
                update(); save();
            }
        }), "check")
        ctrl.$check.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "check",
        }), "icon")

        function update() {
            ctrl.$check.$icon.opacity = getValue() ? 1 : 0;
        }
        update();

        scroller.$content.size.y += 90;
        return ctrl;
    }

    function makePlusMinus(title, getValue, onChange) {
        let ctrl;
        scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#1f1f1f",
            radius: 20,
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        ctrl.append(controls.rect({
            position: Ex(-250, 10, 1, 0),
            size: Ex(220, 60),
            fill: "#000",
        }))
        ctrl.append(controls.label({
            position: Ex(-140, 42, 1, 0),
            scale: 28,
            text: getValue(),
        }), "value")

        ctrl.append(controls.button({
            position: Ex(-70, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(1, update);
                update(); save();
            }
        }), "plus")
        ctrl.$plus.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "plus",
        }), "icon")

        ctrl.append(controls.button({
            position: Ex(-270, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(-1, update);
                update(); save();
            }
        }), "minus")
        ctrl.$minus.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "minus",
        }), "icon")

        function update() {
            ctrl.$value.text = getValue();
        }

        scroller.$content.size.y += 90;
        return ctrl;
    }

    makeHeader("Graphics");
    makePlusMinus("Max Resolution", () => {
        return gameData.prefs.maxRes ? gameData.prefs.maxRes + "p" : "Full"
    }, (dir) => {
        const resList = [360, 480, 640, 800, 1024, 1280, 1520, 1800, 2400, 3200, 4800, 6400];
        const bestRes = Math.max(innerWidth, innerHeight);
        const currentRes = gameData.prefs.maxRes || bestRes;
        let resIndex = resList.findIndex(x => x >= currentRes);
        if (dir > 0) {
            resIndex += 1;
            if (gameData.prefs.maxRes && resIndex < resList.length && resList[resIndex] < bestRes) 
                gameData.prefs.maxRes = resList[resIndex];
            else 
                gameData.prefs.maxRes = 0;
        } else {
            resIndex -= 1;
            if (resIndex >= 0) gameData.prefs.maxRes = resList[resIndex];
        }
    });

    makeHeader("Storage");
    let persistent = makeCheckbox("Persistent Storage", () => {}, (x) => {
        if (x) {
            navigator.storage?.persist?.().then((x) => {
                if (x) persistent.$check.$icon.opacity = 1;
            }) 
        } else {
            callPopup("prompt", 
                "Persistent Storage",
                "Persistent storage can not be disabled without deleting all data from this website.\n\n" +
                    "To disable persistent storage, use your browser's storage manager to delete this website's data.",
                [ 
                    { icon: "arrow-left" },
                ],
            );
        }
    });
    navigator.storage?.persisted?.().then(x => persistent.$check.$icon.opacity = x ? 1 : 0);
    makeText("Request persistent storage to prevent your save from being cleaned up automatically by your browser or other tools.", 3)

    scroller.$content.size.y += 10;
    makeButton("Download Save File", () => {
        downloadSave();
    }, "download");
    makeButton("Upload Save File", () => {
        uploadSave();
    }, "upload").fill = "#5f2f2f";
    makeText("Make sure to back up your save in case you delete your browser's data by accident (that happens more often than you think!)", 3)

    scroller.$content.size.y += 10;
    makeButton("Reset All Data", () => {
        callPopup("prompt", 
            "Reset All Data?",
            "This action will permanently delete all of your progress!\n\n" +
                "Be careful! Once you proceed, there's no way to get the data back!",
            [ 
                { icon: "x" },
                { icon: "check", right: true } 
            ],
            (item) => {
                if (item == "check") totalDestruction();
            }
        );
    }, "trash").fill = "#5f2f2f";


    let lerpItems = [
        [backBtn, 40],
    ]
    for (let ctrl of scroller.$content.controls) {
        let delay = (mainCanvas.height / scale - ctrl.position.y) * .35 + 20;
        if (delay > 40) lerpItems.push([ctrl, delay]);
        else break;
    }
    doItemReveal(lerpItems);

    return menu
}