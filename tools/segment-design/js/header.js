function setupHeader() {
    menuBarSingleton = tippy.createSingleton([], {
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        moveTransition: 'transform 0.2s ease-out',
    });

    $("#header nav").append(
        makeMenuBarItem("File", () => ([
            ["New", () => null],
            ["Open", () => null],
        ])),
        makeMenuBarItem("Edit", () => ([
            ["Cut", () => null],
            ["Copy", () => null],
            ["Paste", () => null],
            null,
            ["Undo", () => null],
            ["Redo", () => null],
        ])),
    );

    window.addEventListener("pointerdown", (e) => {
        console.log(menuBarPopovers.length);
        for (let i = menuBarPopovers.length - 1; i >= 0; i++) {
            if (!menuBarPopovers[i].hideWithInteractivity(e)) break;
        }
    })
}

/** @typedef {([string, MenuBarDef[]] | [string, () => void] | null)} MenuBarDef */

let menuBarInstances = [];
let menuBarSingleton = null;
let menuBarPopovers = [];

/**
 * @param {string} name 
 * @param {() => MenuBarDef[]} items 
 */
function makeMenuBarItem(name, items) {
    let elm = $make.button({}, name);
    let popover = tippy(elm, {
        trigger: "manual",
        placement: "bottom-start",
        onShow() {
            menuBarPopovers.push(popover);
            console.log("showing ", menuBarPopovers.length);
        },
        onHide() {
            let index = menuBarPopovers.indexOf(popover);
            if (index >= 0) menuBarPopovers.splice(index, 1);
            console.log("hidden ", menuBarPopovers.length);
        },
    })
    menuBarInstances.push(popover);
    menuBarSingleton.setInstances(menuBarInstances);
    elm.addEventListener("pointerdown", () => {
        popover.setProps({ content: makeMenuBarMenu(items()) });
        menuBarSingleton.show(popover);
    })
    elm.addEventListener("pointerenter", () => {
        if (menuBarPopovers.length) {
            popover.setProps({ content: makeMenuBarMenu(items()) });
            menuBarSingleton.show(popover);
        }
    })
    return elm;
}

/**
 * @param {MenuBarDef[]} items 
 */
function makeMenuBarMenu(items) {
    let holder = $make.div({className: "menubar-menu"});

    for (let item of items) {
        let itemElm;
        if (!item) {
            itemElm = $make.hr({});
        } else {
            itemElm = $make.button({}, $make.span({}, item[0]));

            let content = item[1];

            if (typeof content == "function") {
                itemElm.addEventListener("click", item[1]());
            } else if (Array.isArray(content)) {
                tippy(itemElm, {
                    placement: "right-start",
                    content: makeMenuBarMenu(item[1]),
                });
            }
        }
        
        holder.append(itemElm);
    }

    return holder;
}