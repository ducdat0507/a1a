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
        radius: 20,
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
            position: Ex(1, scroller.$content.size.y + 35, 0, 0),
            scale: 32,
            style: "700",
            align: "left",
            text: title,
        }));

        scroller.$content.size.y += 65;
        return ctrl;
    }

    function makeButton(title, onClick) {
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
                onChange(1);
                ctrl.$value.text = getValue();
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
                onChange(-1);
                ctrl.$value.text = getValue();
            }
        }), "minus")
        ctrl.$minus.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "minus",
        }), "icon")

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
        console.log(dir, bestRes, currentRes, resIndex);
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
    makeButton("Download Save", () => {
        downloadSave();
    });
    makeButton("Upload Save", () => {
        uploadSave();
    }).fill = "#5f2f2f";
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
    }).fill = "#5f2f2f";


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