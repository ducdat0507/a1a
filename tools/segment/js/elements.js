/** 
 * @typedef ElementHolder
 * @property {HTMLElement} mainContainer
 * @property {HTMLCanvasElement} mainCanvas
 * @property {HTMLElement} controlsHolder
 * @property {CanvasRenderingContext2D} canvasCtx
*/

/** @type {ElementHolder} */
let elements = {}

function setupElements() {
    elements = {
        mainContainer: $("#main-container"),
        mainCanvas: $("#main-canvas"),
        controlsHolder: $("#controls-holder"),
    }
    elements.canvasCtx = elements.mainCanvas.getContext("2d");
}

/**
 * @param {string} query 
 * @returns {HTMLElement | null}
 */
function $(query) {
    return document.querySelector(query);
}