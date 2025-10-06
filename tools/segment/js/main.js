window.addEventListener("DOMContentLoaded", () => {
    setupElements();
    updateCanvas();

    window.addEventListener("resize", () => {
        updateCanvas();
    })
})