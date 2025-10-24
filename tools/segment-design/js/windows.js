/** @type {Record<string, () => AppWindow>} */
const windows = {};
const openWindows = [];

/**
 * @param {string} id
 * @param {PointerEvent} event 
 */
function spawnWindow(id, event) {
    if (windows[id].unique) {
        for (let window of openWindows) if (window instanceof windows[id]) return;
    } 

    let window = $make.div(".window")
    window.append(
        window.$body = $make.div(".body",
            window.$header = $make.div(".header",
                window.$title = $make.div(".header-title"),
                window.$close = $make.button(".header-close", $icon("lucide:x")),
            ),
            window.$content = $make.div(".content"),
        )
    )

    window.setAttribute("data-window", id);

    let data = new windows[id](window);
    openWindows.push(data);

    if (data.style) {
        for (let style in data.style) window.style[style] = data.style[style];
    }

        window.style.setProperty("--left", "100px");
        window.style.setProperty("--top", "100px");

    if (event) {
        window.style.setProperty("--start-left", event.clientX);
        window.style.setProperty("--start-top", event.clientY);
    }

    window.$title.addEventListener("pointerdown", (e) => {
        function pointerMove(e2) {
            console.log(e2.movementX, e2);
            window.style.setProperty("--left", parseFloat(window.style.getPropertyValue("--left")) + e2.movementX + "px");
            window.style.setProperty("--top", parseFloat(window.style.getPropertyValue("--top")) + e2.movementY + "px");
        }
        function pointerUp(e2) {
            window.$title.removeEventListener("pointermove", pointerMove);
            window.$title.removeEventListener("pointerup", pointerUp);
        }
        window.$title.setPointerCapture(e.pointerId);
        window.$title.addEventListener("pointermove", pointerMove);
        window.$title.addEventListener("pointerup", pointerUp);
    })
    window.$close.addEventListener("click", (e) => {
        let index = openWindows.indexOf(data);
        openWindows.splice(index, 1);
        data.cleanup(window);
        window.classList.add("hidden");
        setTimeout(() => window.remove(), 1000);
    })


    document.body.append(window);
}

class AppWindow {

    constructor(element) {}
    
    /**
     * @abstract
     * @param {HTMLElement} element 
     */
    cleanup(element) {}
}