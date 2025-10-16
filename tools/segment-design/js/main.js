function init() {
    load();
    setupElements();
    setupPanes();
    setupTools();
    setupCanvas();
    updateCanvas();

    $("#preloader").style.display = "none";

    events.on("selection-update", save);
    events.on("property-update", save);

    window.addEventListener("resize", () => {
        updateCanvas();
    }, { passive: true })
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    })
    window.addEventListener("keydown", (e) => {
        if (e.key == "Delete") {
            if (activeObjects.size > 0) {
                let first = activeObjects.values().next();
                first = first.value;
                console.log(first);
                if (first instanceof DesignElement) {
                    currentDesign.design = currentDesign.design.filter(x => !activeObjects.has(x));
                } else if (first instanceof SegmentWire) {
                    currentDesign.wires = currentDesign.wires.filter(x => !activeObjects.has(x));
                }
                activeObjects.clear();
                events.emit("selection-update");
            }
        }
    })
}