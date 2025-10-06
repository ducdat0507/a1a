function init() {
    setupElements();
    setupPanes();
    setupCanvas();
    load();
    updateCanvas();

    window.addEventListener("resize", () => {
        updateCanvas();
    }, { passive: true })
}