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

/** @type {Record<string, (params: Partial<HTMLElement>, ...children: any[]) => HTMLElement} */
const $make = Object.freeze(new Proxy({
    /**
     * 
     * @param {string} type 
     * @param {Partial<HTMLElement>} params 
     * @param  {...any} children 
     * @returns 
     */
    run(type, params, ...children) {
        let elm = document.createElement(type);

        if (params) for (let param in params) {
            if (param.includes("-")) elm.setAttribute(param, params[param]);
            if (param.startsWith("on:")) elm.addEventListener(param.substring(3), params[param]);
            else elm[param] = params[param];
        }
        elm.append(...children);
    
        return elm;
    }
}, {
    get(target, prop, receiver) {
        return (params, ...children) => target.run(prop, params, ...children)
    }
}))

function $icon(icon, params) {
    return $make["iconify-icon"]({icon, ...params});
}





tippy.setDefaultProps({
    animation: true,
    render(instance) {
        if (instance._timeout) clearTimeout(instance._timeout);

        const popper = $make.div({className: "tooltip"});
        const box = $make.div();
        popper.appendChild(box);

        box.append(instance.props.content);

        function onUpdate(prevProps, nextProps) {
            if (prevProps.content !== nextProps.content) {
                box.innerText = "";
                box.append(nextProps.content);
            }
        }

        return {
            popper,
            onUpdate,
        };
    },
    onShow(instance) {
        instance.popper.classList.remove("hidden");
        if (instance._timeout) clearTimeout(instance._timeout);
    },
    onHide(instance) {
        instance.popper.classList.add("hidden");
        instance._timeout = setTimeout(instance.unmount, 1000);
    }
});