/** @type {Record<string, () => Pane>} */
const tools = {};
/** @type {Record<string, HTMLButtonElement>} */
const toolButtons = {};
/** @type {Tool | null} */
let currentTool = null;

function setupTools() {
    let tabs = $("#main-tool-strip");
    tabs.append(makeToolButton("cursor", $icon("tabler:pointer")));
    tabs.append($make.hr());
    tabs.append(makeToolButton("pen", $icon("tabler:ballpen")));

    setTool("cursor");
}

function makeToolButton(tool, name) {
    let btn = $make.button({
        onclick: () => setTool(tool)
    }, name);

    toolButtons[tool] = btn;

    return btn;
}

/**
 * @param {string} pane 
 * @param {string} target 
 */
function setTool(tool) {
    currentTool?.cleanup();
    currentTool = new tools[tool]();

    for (let btn in toolButtons) {
        toolButtons[btn].ariaSelected = btn == tool;
    }

    updateCanvas();
}

class Tool {

    constructor() {}
    
    /**
     * @abstract
     */
    drawGizmos() {}
    
    /**
     * @abstract
     * @param {PointerEvent} e 
     */
    onPointerDown(e) {}
    
    /**
     * @abstract
     */
    cleanup() {}
}