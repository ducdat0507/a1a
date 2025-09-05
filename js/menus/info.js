menus.info = (openMenu, closeMenu) => {

    let currentView = "";
    let currentViewBox = null;
    let currentViewScroller = null;

    let menu = controls.base({
        size: Ex(0, 0, 1, 1),
        menuTitle: "Information",
    }, "box")
    
    let backBtn = controls.button({
        position: Ex(0, -80, 0, 1),
        size: Ex(80, 80, 0, 0),
        fill: "#4f4f4f",
        mask: true,
        radius: 40,
        onClick: () => currentView ? unsetView() : closeMenu(),
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

    forms.makeButton("About", () => setView("about"), "chevron-right");
    forms.makeButton("Credits", () => setView("credits"), "chevron-right");

    forms.doneForms();
    

    function setView(view) {
        if (currentView) return;
        currentView = view;
        if (currentViewBox) menu.remove(currentViewBox);
        
        currentViewBox = controls.rect({
            position: Ex(0, 80, 1, 0),
            size: Ex(0, -180, 1, 1),
            fill: "#0000",
            radius: 40,
            mask: true,
        })
        menu.prepend(currentViewBox);

        currentViewScroller = controls.scroller({
            position: Ex(0, 0),
            size: Ex(0, 0, 1, 1),
        });
        currentViewBox.append(currentViewScroller);

        forms.beginForms(currentViewScroller);
        infos[view](currentViewScroller);
        forms.doneForms();

        renderControls(currentViewScroller.$content.controls, box.rect, 0.001);

        tween(500, (t) => {
            if (!currentView) return true;

            let value = ease.back.out(t) ** .3;
            currentViewBox.position.x = 
                (currentViewBox.position.ex = 1 - value) * 40;
            currentViewBox.alpha = value;
            box.position.x = 
                (box.position.ex = -value) * 40;
            box.alpha = 1 - value;
        })
        let lerpItems = []
        for (let ctrl of currentViewScroller.$content.controls) {
            let delay = (mainCanvas.height / scale - ctrl.position.y + ctrl.position.ex * 500) * .35 + 20;
            if (delay > 40) lerpItems.push([ctrl, delay]);
            else break;
        }
        doItemReveal(lerpItems);
    }

    function unsetView(view) {
        if (!currentView) return;
        currentView = "";

        tween(500, (t) => {
            if (currentView) return true;

            let value = ease.back.out(t) ** .3;
            currentViewBox.position.x = 
                (currentViewBox.position.ex = value) * 40;
            currentViewBox.alpha = 1 - value;
            box.position.x = 
                (box.position.ex = -1 + value) * 40;
            box.alpha = value;
        }).then(() => {
            if (currentView) return;
            menu.remove(currentViewBox);
            currentViewBox = currentViewScroller = null;
        })
    }



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