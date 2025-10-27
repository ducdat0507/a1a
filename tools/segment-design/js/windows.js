/** @type {Record<string, () => AppWindow>} */
const windows = {};
const openWindows = [];

/**
 * @param {string} id
 * @param {PointerEvent} event 
 */
function spawnWindow(id, event, ...args) {
    if (windows[id].unique) {
        for (let window of openWindows) if (window instanceof windows[id]) return;
    } 

    let subwindow = $make.div(".window")
    subwindow.append(
        subwindow.$body = $make.div(".body",
            subwindow.$header = $make.div(".header",
                subwindow.$title = $make.div(".header-title"),
                subwindow.$close = $make.button(".header-close", $icon("lucide:x")),
            ),
            subwindow.$content = $make.div(".content"),
        )
    )

    subwindow.setAttribute("data-window", id);
    document.body.append(subwindow);

    let data = new windows[id](subwindow, ...args);
    openWindows.push(data);

    if (data.style) {
        for (let style in data.style) subwindow.style[style] = data.style[style];
    }


    if (event) {
        let rect = subwindow.getBoundingClientRect();
        subwindow.style.setProperty("--left", Math.min(Math.max(event.clientX - rect.width / 2, 30), window.innerWidth - rect.width - 30) + "px");
        subwindow.style.setProperty("--top", Math.min(Math.max(event.clientY - rect.height / 2, 56), window.innerHeight - rect.height - 56) + "px");
        subwindow.style.setProperty("--start-left", event.clientX + "px");
        subwindow.style.setProperty("--start-top", event.clientY + "px");
    } else {
        subwindow.style.setProperty("--left", "100px");
        subwindow.style.setProperty("--top", "100px");
    }

    subwindow.$title.addEventListener("pointerdown", (e) => {
        let offset = Vector2(
            parseFloat(subwindow.style.getPropertyValue("--left")) - e.clientX,
            parseFloat(subwindow.style.getPropertyValue("--top")) - e.clientY
        )
        function pointerMove(e2) {
            let rect = subwindow.getBoundingClientRect();
            subwindow.style.setProperty("--left", Math.min(Math.max(e2.clientX + offset.x, 0), window.innerWidth - rect.width - 0) + "px");
            subwindow.style.setProperty("--top", Math.min(Math.max(e2.clientY + offset.y, 26), window.innerHeight - rect.height - 26) + "px");
        }
        function pointerUp(e2) {
            subwindow.$title.removeEventListener("pointermove", pointerMove);
            subwindow.$title.removeEventListener("pointerup", pointerUp);
        }
        subwindow.$title.setPointerCapture(e.pointerId);
        subwindow.$title.addEventListener("pointermove", pointerMove);
        subwindow.$title.addEventListener("pointerup", pointerUp);
    })
    subwindow.$close.addEventListener("click", (e) => {
        let index = openWindows.indexOf(data);
        openWindows.splice(index, 1);
        data.cleanup(subwindow);
        subwindow.classList.add("hidden");
        setTimeout(() => subwindow.remove(), 1000);
    })


}

class AppWindow {

    constructor(element) {}
    
    /**
     * @abstract
     * @param {HTMLElement} element 
     */
    cleanup(element) {}
}