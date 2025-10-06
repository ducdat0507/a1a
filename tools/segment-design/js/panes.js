/** @type {Record<string, () => Pane>} */
const panes = {};
/** @type {Record<string, Record<string, HTMLButtonElement>>} */
const paneButtons = {};
/** @type {Record<string, Pane>} */
const currentPanes = {};

function setupPanes() {
    let tabs = $("#pane-tabs-top");
    tabs.append(makePaneButton("design", "Design", "pane-holder-top"));
    tabs.append(makePaneButton("lights", "Lights", "pane-holder-top"));

    setPane("design", "pane-holder-top");
}

function makePaneButton(pane, name, target) {
    let btn = $make.button({
        onclick: () => setPane(pane, target)
    }, name);

    if (!paneButtons[target]) paneButtons[target] = {};
    paneButtons[target][pane] = btn;

    return btn;
}

/**
 * @param {string} pane 
 * @param {string} target 
 */
function setPane(pane, target) {
    let targetElm = $("#" + target);

    currentPanes[target]?.cleanup(targetElm);
    targetElm.innerText = "";
    currentPanes[target] = new panes[pane]();
    currentPanes[target].populate(targetElm);

    for (let btn in paneButtons[target]) {
        paneButtons[target][btn].ariaSelected = btn == pane;
    }
}

class Pane {

    constructor() {}

    /** @abstract */
    populate(element) {}
    
    /** @abstract */
    cleanup(element) {}
}