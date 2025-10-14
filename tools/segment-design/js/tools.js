/** @type {Record<string, () => Pane>} */
const tools = {};
/** @type {Record<string, HTMLButtonElement>} */
const toolButtons = {};
/** @type {Tool | null} */
let currentTool = null;

function setupTools() {
    let tabs = $("#main-tool-strip");
    tabs.append(makeToolButton("cursor", $icon("tabler:pointer"), "Cursor"));

    tabs.append($make.hr());

    tabs.append(makeToolButton("pen", $icon("tabler:ballpen"), "Pen"));
    tabs.append(makeToolButton("wire", $icon("lucide:lightbulb"), "Wire"));

    setTool("cursor");
    updateTools();
}

function updateTools() {
    console.log(toolButtons);
    if (toolButtons.pen) {
        toolButtons["pen"].style.display = currentPanes["pane-holder-top"] instanceof panes.design ? "" : "none";
        toolButtons["wire"].style.display = currentPanes["pane-holder-top"] instanceof panes.lights ? "" : "none";
    }
}

function makeToolButton(tool, child, title) {
    let btn = $make.button({
        onclick: () => setTool(tool)
    }, child);

    tippy(btn, { 
        content: title,
    });

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