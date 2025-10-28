function setupHeader() {
    menuBarSingleton = tippy.createSingleton([], {
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        moveTransition: 'transform 0.3s cubic-bezier(0.1, 1, 0, 1)',
        offset: [-1, 5],
        popperOptions: {
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        padding: 4,
                    },
                },
            ]
        },
        appendTo() { 
            return document.body;
        },
        onShow(instance) {
            instance.popper.classList.remove("hidden");
            instance.reference.classList.add("active");
            if (instance._timeout) clearTimeout(instance._timeout);

            menuBarPopovers.push(instance);
        },
        onHide(instance) {
            instance.popper.classList.add("hidden");
            instance.reference.classList.remove("active");
            instance._timeout = setTimeout(instance.unmount, 500);

            let index = menuBarPopovers.indexOf(instance);
            if (index >= 0) menuBarPopovers.splice(index, 1);
            menuBarActiveButton?.classList.remove("active");
        },
    });

    $("#header nav").append(
        makeMenuBarItem("File", () => ([
            ["New Design...",  {}, (e) => spawnWindow("new", e)],
            ["Design Browser...", {}, (e) => spawnWindow("browser", e)],
        ])),
        makeMenuBarItem("Edit", () => ([
            ["Cut",    { icon: "lucide:scissors",  shortcut: "Ctrl+X", },  () => null],
            ["Copy",   { icon: "lucide:copy",      shortcut: "Ctrl+C", },  () => null],
            ["Paste",  { icon: "lucide:clipboard", shortcut: "Ctrl+V", },  () => null],
            null,
            ["Undo",   { icon: "lucide:undo",      shortcut: "Ctrl+Z", },  () => null],
            ["Redo",   { icon: "lucide:redo",      shortcut: "Ctrl+Y", },  () => null],
            null,
            ["Path", {}, [
                ["Object to Path", {}, () => null],
                ["Stroke to Path", {}, () => null],
                null,
                ["Join", {}, () => null],
                ["Union", {}, () => null],
                ["Subtract", {}, () => null],
                ["Intersection", {}, () => null],
                ["Exclusion", {}, () => null],
            ]],
            null,
            ["Preferences...",  { icon: "lucide:cog" },  () => null],
        ])),
        makeMenuBarItem("View", () => ([
            ["Panel Size", {}, [
                ["Small", {}, () => null],
                ["Medium", {}, () => null],
                ["Large", {}, () => null],
            ]],
        ])),
        makeMenuBarItem("Help", () => ([
            ["About", {}, (e) => spawnWindow("about", e)],
        ])),
    );

    window.addEventListener("pointerdown", (e) => {
        console.log(menuBarPopovers.length, menuBarDown);
        if (menuBarDown) {
            menuBarDown = false;
        } else {
            for (let i = menuBarPopovers.length - 1; i >= 0; i++) {
                let r = menuBarSingleton.hideWithInteractivity(e);
                console.log("hiding", r, menuBarPopovers[i]);
                if (!r) break;
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    })
}

/**
 *  @typedef {object} MenuBarOption
 *  @prop {string?} MenuBarOption.icon
 *  @prop {string?} MenuBarOption.shortcut
*/
/** @typedef {([string, MenuBarOption, MenuBarDef[]] | [string, MenuBarOption, () => void] | null)} MenuBarDef */

let menuBarInstances = [];
let menuBarSingleton = null;
let menuBarPopovers = [];
let menuBarDown = false;
let menuBarActiveButton = null;

/**
 * @param {string} name 
 * @param {() => MenuBarDef[]} items 
 */
function makeMenuBarItem(name, items) {
    let elm = $make.button({}, name);
    let popover = tippy(elm, {})
    elm.addEventListener("pointerdown", (e) => {
        if (!menuBarPopovers.length) {
            e.preventDefault();
            e.stopImmediatePropagation();
            menuBarSingleton.show(popover);
            menuBarSingleton.setContent(makeMenuBarMenu(items()));
            menuBarActiveButton?.classList.remove("active");
            menuBarActiveButton = elm;
            elm.classList.add("active");
            menuBarDown = true;
        }
    });
    elm.addEventListener("pointerenter", (e) => {
        if (menuBarPopovers.length) {
            e.preventDefault();
            e.stopImmediatePropagation();
            menuBarSingleton.show(popover);
            menuBarSingleton.setContent(makeMenuBarMenu(items()));
            menuBarActiveButton?.classList.remove("active");
            menuBarActiveButton = elm;
            elm.classList.add("active");
        }
    });
    menuBarInstances.push(popover);
    menuBarSingleton.setInstances(menuBarInstances);
    return elm;
}

/**
 * @param {MenuBarDef[]} items 
 */
function makeMenuBarMenu(items) {
    let holder = $make.div(".menu-bar-menu");

    for (let item of items) {
        let itemElm;
        if (!item) {
            itemElm = $make.hr({});
        } else {
            itemElm = $make.button({}, $make.span({}, item[0]));

            let content = item[2];
            let options = item[1];

            if (options.icon) {
                itemElm.prepend($icon(options.icon));
            }
            if (options.shortcut) {
                itemElm.append($make.kbd({}, options.shortcut));
            }

            if (typeof content == "function") {
                itemElm.addEventListener("click", (e) => {
                    content(e);
                    menuBarPopovers[0]?.hide();
                });
            } else if (Array.isArray(content)) {
                itemElm.append($icon("lucide:chevron-right"));
                let popover = tippy(itemElm, {
                    placement: "right-start",
                    trigger: "mouseenter click focus",
                    content: makeMenuBarMenu(content),
                    interactive: true,
                    offset: [-4, 8],
                    delay: 250,
                    onShow(instance) {
                        instance.popper.classList.remove("hidden");
                        instance.reference.classList.add("active");
                        if (instance._timeout) clearTimeout(instance._timeout);
                    },
                    onHide(instance) {
                        instance.popper.classList.add("hidden");
                        instance.reference.classList.remove("active");
                        instance._timeout = setTimeout(instance.unmount, 500);
                    },
                });
                itemElm.addEventListener("click", popover.show);
            }
        }
        
        holder.append(itemElm);
    }

    return holder;
}