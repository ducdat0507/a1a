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

    forms.beginForms(scroller);

    forms.makeHeader("Graphics");
    forms.makePlusMinus("Resolution", () => {
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
    forms.makePlusMinus("Frame Rate", () => {
        return gameData.prefs.targetFps ? gameData.prefs.targetFps + "fps" : "Auto"
    }, (dir) => {
        const list = [15, 30, 60, 0];
        let index = list.findIndex(x => x == gameData.prefs.targetFps);
        if (dir > 0) {
            index = Math.min(index + 1, list.length - 1);
        } else {
            index = Math.max(index - 1, 0);
        }
        gameData.prefs.targetFps = list[index];
        fps = [];
    });

    forms.makeHeader("Storage");
    if (navigator.storage?.persist) {
        let persisted = false;
        let persistent = forms.makeCheckbox("Persistent Storage", () => persisted, (x) => {
            if (x) {
                callPopup("prompt", 
                    "Persistent Storage",
                    "Would you like to enable persistent storage?\n\n" +
                        "You will not be able to disable persistent storage without deleting all data from this website.",
                    [ 
                        { icon: "x" },
                        { icon: "check", right: true },
                    ],
                    (item) => {
                        if (item == "check") {
                            navigator.storage?.persist?.().then((x) => {
                                persisted = x;
                                if (x) {
                                    persistent.$check.$icon.alpha = 1;
                                    callPopup("prompt", 
                                        "Persistent Storage",
                                        "Successfully enabled persistent storage.",
                                        [ 
                                            { icon: "arrow-left" },
                                        ],
                                    )
                                } else {
                                    callPopup("prompt", 
                                        "Persistent Storage",
                                        "Failed to enable persistent storage. Browsers may refuse to grant persistent storage unless you play on this website for long enough.",
                                        [ 
                                            { icon: "arrow-left" },
                                        ],
                                    )
                                }
                            }) 
                        }
                    }
                );
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
        navigator.storage?.persisted?.().then(x => persistent.$check.$icon.alpha = (persisted = x) ? 1 : 0);
        forms.makeText("Request persistent storage to prevent your save from being cleaned up automatically by your browser or other tools.", 3)
    }

    scroller.$content.size.y += 10;
    forms.makeButton("Download Save File", () => {
        downloadSave();
    }, "download");
    forms.makeButton("Upload Save File", () => {
        uploadSave();
    }, "upload").fill = "#5f2f2f";
    forms.makeText("Make sure to back up your save in case you delete your browser's data by accident (that happens more often than you think!)", 3)

    scroller.$content.size.y += 10;
    forms.makeButton("Reset All Data", () => {
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

    forms.makeHeader("Debug");
    forms.makeCheckbox("Show Performance Stats", () => gameData.prefs.showFps, (x) => gameData.prefs.showFps = x);

    forms.doneForms();


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