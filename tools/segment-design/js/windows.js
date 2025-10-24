/** @type {Record<string, () => AppWindow>} */
const windows = {};

/**
 * @param {string id}
 */
function spawnWindow(id) {
    let window = $make.div(".window")
    window.append(
        window.$body = $make.div(".body",
            window.$header = $make.div(".header",
                window.$title = $make.div(".header-title"),
                window.$close = $make.button(".header-close", $icon("lucide:x", { style: "font-size:16px;vertical-align:-3px" })),
            ),
            window.$content = $make.div(".content"),
        )
    )

    let data = new windows[id](window);

    if (data.style) {
        for (let style in data.style) window.style[style] = data.style[style];
    }

    window.style.top = "100px";
    window.style.left = "100px";

    window.$title.addEventListener("pointerdown", (e) => {
        function pointerMove(e2) {
            console.log(e2.movementX, e2);
            window.style.left = parseFloat(window.style.left) + e2.movementX + "px";
            window.style.top = parseFloat(window.style.top) + e2.movementY + "px";
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
        data.cleanup(window);
        window.classList.add("hidden");
        setTimeout(window.remove, 1000);
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