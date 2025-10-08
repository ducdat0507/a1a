tools.cursor = class extends Tool {

    gizmos = [];

    constructor() {
        super();
    }

    updateGizmos() {
        this.gizmos = [];

        for (let item of activeObjects) {
            if (item instanceof PathDesignElement) {
                for (let node of item.nodes) {
                    this.gizmos.push({
                        type: "node-center",
                        target: node,
                        gridPos: node.center,
                    })
                }
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
        // Primary button
        if (e.button == 0) {
            
            // Check for gizmo clicks
            let gizmoScale = 1 / canvasScale;
            let gizmoRange = 7 * canvasScale;

            for (let gizmo of this.gizmos) {
                if (
                    (gizmo.canvasPos.x * gizmoScale - e.clientX * canvasScale) ** 2 
                    + (gizmo.canvasPos.y * gizmoScale - e.clientY * canvasScale) ** 2
                    <= gizmoRange * gizmoRange
                ) {
                    switch (gizmo.type) {
                        case "node-center":
                            doCanvasMouseDrag(e, e2 => {
                                let newPos = Vector2 (
                                    Math.round(e2.clientX / gridZoom + gridLeft),
                                    Math.round(e2.clientY / gridZoom + gridTop)
                                )
                                let offset = Vector2 (
                                    newPos.x - gizmo.target.center.x,
                                    newPos.y - gizmo.target.center.y
                                )
                                gizmo.target.center.x += offset.x;
                                gizmo.target.center.y += offset.y;
                                events.emit("property-update");
                            })
                            break;
                    }
                    return;
                }
            }


            // Check for object clicks
            for (let elm of currentDesign.design.toReversed()) {
                let path = elm.toPath();
                transformPathToCanvas(path);
                if (!elm.stroke.thickness) {
                    let s = path.copy().stroke({
                        width: 2 * canvasScale,
                        join: PathStrokeJoin.ROUND,
                        cap: PathStrokeCap.ROUND,
                    });
                    s.simplify();
                    path.op(s, PathKit.PathOp.UNION);
                    s.delete();
                }
                let path2D = path.toPath2D();
                if (elements.canvasCtx.isPointInPath(
                    path2D, 
                    e.clientX * canvasScale,
                    e.clientY * canvasScale,
                )) {
                    activeObjects.clear();
                    activeObjects.add(elm);
                    
                    let oldPos = Vector2 (
                        Math.round(e.clientX / gridZoom + gridLeft),
                        Math.round(e.clientY / gridZoom + gridTop)
                    )
                    doCanvasMouseDrag(e, e2 => {
                        let newPos = Vector2 (
                            Math.round(e2.clientX / gridZoom + gridLeft),
                            Math.round(e2.clientY / gridZoom + gridTop)
                        )
                        let offset = Vector2 (
                            newPos.x - oldPos.x,
                            newPos.y - oldPos.y
                        )
                        for (let elm of activeObjects) {
                            if (elm instanceof PathDesignElement) for (let node of elm.nodes) {
                                node.center.x += offset.x;
                                node.center.y += offset.y;
                            }
                        }
                        oldPos = newPos;
                        events.emit("property-update");
                    })
                    
                    path.delete();
                    events.emit("selection-update");
                    return;
                }
                path.delete();
            }

            // Clicked on nothing 
            if (activeObjects.size) {
                activeObjects.clear();
                events.emit("selection-update");
            }
        }
    }

    cleanup() {

    }

}