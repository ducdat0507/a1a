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

const $make = Object.freeze(new Proxy({
    /**
     * 
     * @param {string} type 
     * @param {object} params 
     * @param  {...any} children 
     * @returns 
     */
    run(type, params, ...children) {
        let elm = document.createElement(type);

        for (let param in params) elm[param] = params[param];
        elm.append(...children);
    
        return elm;
    }
}, {
    get(target, prop, receiver) {
        return (params, ...children) => target.run(prop, params, ...children)
    }
}))