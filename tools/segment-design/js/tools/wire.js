tools.wire = class extends Tool {

    mousePos = Vector2(0, 0);

    constructor() {
        super();
        
        elements.mainCanvas.addEventListener("pointermove", this.onPointerMove);
    }

    updateGizmos() {
        
    }

    drawGizmos() {
        this.updateGizmos();

        const ctx = elements.canvasCtx;
        const gizmoScale = 6 * canvasScale;
        
        ctx.lineWidth = 2 * canvasScale;
        
        // Draw temp gizmo
        {
            let canvasPos = Vector2(
                (this.mousePos.x - gridLeft) * gridZoom,
                (this.mousePos.y - gridTop) * gridZoom
            )
            console.log(this.mousePos, canvasPos);
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(
                Math.round(canvasPos.x),
                Math.round(canvasPos.y),
                1.5 * gizmoScale,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e) {

        const finalize = () => {
            let tempElm = new SegmentWire({position: this.mousePos});
            currentDesign.wires.push(tempElm);
            activeObjects.clear();
            activeObjects.add(tempElm);
            this.nodes = [];
            this.gizmos = [];
            this.mayClose = false;
        }

        if (e.button == 0) {
            finalize();
            events.emit("selection-update", "wire");
        }
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e) {
        currentTool.mousePos = Vector2(
            Math.round(e.clientX / gridZoom + gridLeft),
            Math.round(e.clientY / gridZoom + gridTop)
        )
        updateCanvas();
    }

    cleanup() {
        elements.mainCanvas.removeEventListener("pointermove", this.onPointerMove);
    }

}