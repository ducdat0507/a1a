function init() {
    load();
    setupElements();
    setupHeader();
    setupFooter();
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
        if (e.key == "c" && e.ctrlKey) {
            clipboardObjects = new Set(activeObjects);
        }
        if (e.key == "v" && e.ctrlKey) {
            if (clipboardObjects.size > 0) {
                let newClipboardObjects = new Set();
                let first = clipboardObjects.values().next();
                first = first.value;
                console.log(first);
                if (first instanceof DesignElement) {
                    for (let item of clipboardObjects) {
                        let clone = new PathDesignElement(JSON.parse(JSON.stringify(item)));
                        newClipboardObjects.add(clone);
                        currentDesign.design.push(clone);
                    }
                } else if (first instanceof SegmentWire) {
                    for (let item of clipboardObjects) {
                        let clone = new SegmentWire(JSON.parse(JSON.stringify(item)));
                        newClipboardObjects.add(clone);
                        currentDesign.wires.push(clone);
                    }
                }
                activeObjects = newClipboardObjects;
                events.emit("selection-update");
            }
        }
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