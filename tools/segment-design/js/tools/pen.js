tools.pen = class extends Tool {

    nodes = [];
    mayClose = false;
    mousePos = Vector2(0, 0);
    gizmos = [];

    constructor() {
        super();
        
        elements.mainCanvas.addEventListener("pointermove", this.onPointerMove);
    }

    updateGizmos() {
        for (let node of this.nodes) {
            this.gizmos.push({
                type: "node-center",
                target: node,
                gridPos: node.center,
            })
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
        
        // Draw temp path
        if (this.nodes.length) {
            let tempElm = new PathDesignElement({nodes: this.nodes, mayClose: this.mayClose})
            let tempPath = tempElm.toPath();
            transformPathToCanvas(tempPath);
            ctx.beginPath();
            tempPath.toCanvas(ctx);
            ctx.strokeStyle = "white";
            ctx.stroke();
            tempPath.delete();
        }

        // Draw temp gizmo
        {
            let canvasPos = Vector2(
                (this.mousePos.x - gridLeft) * gridZoom,
                (this.mousePos.y - gridTop) * gridZoom
            )
            console.log(this.mousePos, canvasPos);
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.rect(
                Math.round(canvasPos.x) - gizmoScale,
                Math.round(canvasPos.y) - gizmoScale,
                2 * gizmoScale,
                2 * gizmoScale
            );
            ctx.stroke();
        }


        // Draw gizmos
        for (let gizmo of this.gizmos) {
            switch (gizmo.type) {
                case "node-center":
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.rect(
                        Math.round(gizmo.canvasPos.x) - gizmoScale,
                        Math.round(gizmo.canvasPos.y) - gizmoScale,
                        2 * gizmoScale,
                        2 * gizmoScale
                    );
                    ctx.fill();
                    ctx.stroke();
                    break;
            }
        }
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e) {

        const finalize = () => {
            let tempElm = new PathDesignElement({nodes: this.nodes, mayClose: this.mayClose});
            currentDesign.design.push(tempElm);
            activeObjects.clear();
            activeObjects.add(tempElm);
            this.nodes = [];
            this.gizmos = [];
            this.mayClose = false;
        }

        if (e.button == 0) {
            let gizmoScale = 1 / canvasScale;
            let gizmoRange = 7 * canvasScale;

            // clicked on original gizmo 
            {
                let gizmo = this.gizmos[0];
                if (
                    gizmo &&
                    (gizmo.canvasPos.x * gizmoScale - e.clientX * canvasScale) ** 2 
                    + (gizmo.canvasPos.y * gizmoScale - e.clientY * canvasScale) ** 2
                    <= gizmoRange * gizmoRange
                ) {
                    this.mayClose = true;
                    finalize();
                    events.emit("selection-update", "pen");
                    return;
                }
            }

            // add new node
            let pos = this.mousePos;
            this.nodes.push({
                center: pos
            })
            updateCanvas();
            
        } else if (e.button == 2) {
            if (this.nodes.length) {
                finalize();
                events.emit("selection-update", "pen");
            } else {
                updateCanvas();
            }
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