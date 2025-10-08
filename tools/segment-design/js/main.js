function init() {
    load();
    setupElements();
    setupPanes();
    setupTools();
    setupCanvas();
    updateCanvas();

    $("#preloader").style.display = "none";

    window.addEventListener("resize", () => {
        updateCanvas();
        paneButtons();
    }, { passive: true })
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    })
    window.addEventListener("keydown", (e) => {
        if (e.key == "Delete") {
            if (activeObjects.size > 0) {
                currentDesign.design = currentDesign.design.filter(x => !activeObjects.has(x));
                activeObjects.clear();
                events.emit("selection-update");
            }
        }
    })
}