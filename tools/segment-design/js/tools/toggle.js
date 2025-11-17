tools.toggle = class extends Tool {

    gizmos = [];

    constructor() {
        super();
        
        elements.mainCanvas.addEventListener("pointermove", this.onPointerMove);
    }

    updateGizmos() {
        this.gizmos = [];
        
        if (currentPanes["pane-holder-top"] instanceof panes.lights) {
            for (let wire of currentDesign.wires) {
                this.gizmos.push({
                    type: "wire",
                    target: wire,
                    gridPos: wire.position,
                })
            }
        }
 
        let scale = gridZoom * canvasScale;
        for (let gizmo of this.gizmos) {
            gizmo.canvasPos = Vector2(
                (gizmo.gridPos.x - gridLeft) * scale,
                (gizmo.gridPos.y - gridTop) * scale,
            )
        }
    }

    drawGizmos() {
        this.updateGizmos();

        const ctx = elements.canvasCtx;
        const gizmoScale = 6 * canvasScale;
        
        ctx.lineWidth = 2 * canvasScale;
     
        // Draw nodes
        for (let gizmo of this.gizmos) {
            switch (gizmo.type) {
                case "wire":
                    let selected = activeObjects.has(gizmo.target);
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.arc(
                        Math.round(gizmo.canvasPos.x),
                        Math.round(gizmo.canvasPos.y),
                        2 * gizmoScale,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = "#0007";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(
                        Math.round(gizmo.canvasPos.x),
                        Math.round(gizmo.canvasPos.y),
                        1.5 * gizmoScale,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = selected ? "#7f7a" : "#fff7";
                    ctx.stroke();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(
                        Math.round(gizmo.canvasPos.x),
                        Math.round(gizmo.canvasPos.y),
                        0.5 * gizmoScale,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                    break;
            }
        }
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e) {
        let gizmoScale = 1 / canvasScale;
        let gizmoRange = 7 * canvasScale;

        // Primary button
        if (e.button == 0) {
            // Check for gizmo clicks
            for (let gizmo of this.gizmos) {
                if (
                    (gizmo.canvasPos.x * gizmoScale - e.offsetX * canvasScale) ** 2 
                    + (gizmo.canvasPos.y * gizmoScale - e.offsetY * canvasScale) ** 2
                    <= gizmoRange * gizmoRange
                ) {
                    switch (gizmo.type) {
                        case "wire":
                            gizmo.target.digits[previewNumber] = !gizmo.target.digits[previewNumber]
                            events.emit("selection-update");
                            break;
                    }
                    return;
                }
            }
        }
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e) {
        currentTool.mousePos = Vector2(
            Math.round(e.offsetX / gridZoom + gridLeft),
            Math.round(e.offsetY / gridZoom + gridTop)
        )
        setFooterStat("mousePos", "tabler:pointer", `${currentTool.mousePos.x} ${currentTool.mousePos.y}`);
        updateCanvas();
    }

    cleanup() {
        elements.mainCanvas.removeEventListener("pointermove", this.onPointerMove);
    }
}