tools.cursor = class extends Tool {

    gizmos = [];

    constructor() {
        super();
        
        elements.mainCanvas.addEventListener("pointermove", this.onPointerMove);
    }

    updateGizmos() {
        this.gizmos = [];
        
        for (let item of activeObjects) {
            if (item instanceof PathDesignElement) {
                let index = 0;
                for (let node of item.nodes) {
                    this.gizmos.push({
                        type: "node-center",
                        target: node,
                        index,
                        gridPos: node.center,
                    })
                    if (node.bezierP1 || node.bezierP2) {
                        let nextNode = item.nodes[(index + 1) % item.nodes.length]
                        this.gizmos.push({
                            type: "node-bezier-p1",
                            target: node,
                            index,
                            gridPos: node.bezierP1 ?? Vector2(
                                node.center.x + (nextNode.center.x - node.center.x) / 3,
                                node.center.y + (nextNode.center.y - node.center.y) / 3
                            ),
                        })
                        this.gizmos.push({
                            type: "node-bezier-p2",
                            target: node,
                            index,
                            gridPos: node.bezierP2 ?? Vector2(
                                node.center.x + (nextNode.center.x - node.center.x) / 3 * 2,
                                node.center.y + (nextNode.center.y - node.center.y) / 3 * 2
                            ),
                        })
                    }
                    index++;
                }
            } else if (item == currentDesign) {
                let base = Vector2(
                    gridLeft + 20 / gridZoom,
                    gridTop + 20 / gridZoom
                )
                this.gizmos.push({
                    type: "digit-width",
                    gridPos: Vector2(currentDesign.spec.width, base.y),
                })
                this.gizmos.push({
                    type: "digit-height",
                    gridPos: Vector2(base.x, currentDesign.spec.height),
                })
                this.gizmos.push({
                    type: "char-space",
                    gridPos: Vector2(currentDesign.spec.width + currentDesign.spec.charSpace, base.y),
                })
                this.gizmos.push({
                    type: "sep-space",
                    gridPos: Vector2(currentDesign.spec.width + currentDesign.spec.sepSpace, base.y),
                })
                console.log(this.gizmos);
            }
        }
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

        for (let gizmo of this.gizmos) {
            switch (gizmo.type) {
                case "digit-width": case "char-space": case "sep-space":
                    ctx.fillStyle = gizmo.type == "digit-width" ? "lime" : "gray";
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(
                        gizmo.canvasPos.x - 1 * gizmoScale,
                        gizmo.canvasPos.y - 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 1 * gizmoScale,
                        gizmo.canvasPos.y - 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 1 * gizmoScale,
                        gizmo.canvasPos.y + 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x,
                        gizmo.canvasPos.y + 2 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x - 1 * gizmoScale,
                        gizmo.canvasPos.y + 1 * gizmoScale,
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
                case "digit-height":
                    ctx.fillStyle = "lime";
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(
                        gizmo.canvasPos.x - 1 * gizmoScale,
                        gizmo.canvasPos.y - 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 1 * gizmoScale,
                        gizmo.canvasPos.y - 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 2 * gizmoScale,
                        gizmo.canvasPos.y,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 1 * gizmoScale,
                        gizmo.canvasPos.y + 1 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x - 1 * gizmoScale,
                        gizmo.canvasPos.y + 1 * gizmoScale,
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
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
                case "node-bezier-p1": case "node-bezier-p2":
                    let known = gizmo.type.endsWith("1") ? gizmo.target.bezierP1 : gizmo.target.bezierP2
                    ctx.fillStyle = known ? "red" : "gray";
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(
                        gizmo.canvasPos.x - 1.414 * gizmoScale,
                        gizmo.canvasPos.y,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x,
                        gizmo.canvasPos.y + 1.414 * gizmoScale,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x + 1.414 * gizmoScale,
                        gizmo.canvasPos.y,
                    );
                    ctx.lineTo(
                        gizmo.canvasPos.x,
                        gizmo.canvasPos.y - 1.414 * gizmoScale,
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
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
        // Primary button
        if (e.button == 0) {
            
            // Check for gizmo clicks
            let gizmoScale = 1 / canvasScale;
            let gizmoRange = 7 * canvasScale;

            for (let gizmo of this.gizmos) {
                if (
                    (gizmo.canvasPos.x * gizmoScale - e.offsetX * canvasScale) ** 2 
                    + (gizmo.canvasPos.y * gizmoScale - e.offsetY * canvasScale) ** 2
                    <= gizmoRange * gizmoRange
                ) {
                    switch (gizmo.type) {
                        case "digit-width":
                            doCanvasMouseDrag(e, e2 => {
                                currentDesign.spec.width = Math.round(e2.offsetX / gridZoom + gridLeft);
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })
                            break;
                        case "digit-height":
                            doCanvasMouseDrag(e, e2 => {
                                currentDesign.spec.height = Math.round(e2.offsetY / gridZoom + gridTop);
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })
                            break;
                        case "char-space":
                            doCanvasMouseDrag(e, e2 => {
                                currentDesign.spec.charSpace = Math.round(e2.offsetX / gridZoom + gridLeft) - currentDesign.spec.width;
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })
                            break;
                        case "sep-space":
                            doCanvasMouseDrag(e, e2 => {
                                currentDesign.spec.sepSpace = Math.round(e2.offsetX / gridZoom + gridLeft) - currentDesign.spec.width;
                                currentDesign.spec.sepSpace = Math.max(currentDesign.spec.sepSpace, currentDesign.spec.charSpace);
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })
                            break;
                        case "node-center":
                            doCanvasMouseDrag(e, e2 => {
                                let newPos = Vector2 (
                                    Math.round(e2.offsetX / gridZoom + gridLeft),
                                    Math.round(e2.offsetY / gridZoom + gridTop)
                                )
                                let offset = Vector2 (
                                    newPos.x - gizmo.target.center.x,
                                    newPos.y - gizmo.target.center.y
                                )
                                gizmo.target.center.x += offset.x;
                                gizmo.target.center.y += offset.y;
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })
                            break;
                        case "wire":
                            doCanvasMouseDrag(e, e2 => {
                                let newPos = Vector2 (
                                    Math.round(e2.offsetX / gridZoom + gridLeft),
                                    Math.round(e2.offsetY / gridZoom + gridTop)
                                )
                                let offset = Vector2 (
                                    newPos.x - gizmo.target.position.x,
                                    newPos.y - gizmo.target.position.y
                                )
                                gizmo.target.position.x += offset.x;
                                gizmo.target.position.y += offset.y;
                                events.emit("property-update", "cursor", -1);
                            }, () => {
                                events.emit("property-update", "cursor");
                            })

                            activeObjects.clear();
                            activeObjects.add(gizmo.target);
                            events.emit("selection-update");
                            break;
                    }
                    return;
                }
            }


            // Check for object clicks
            if (currentPanes["pane-holder-top"] instanceof panes.design) {
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
                        e.offsetX * canvasScale,
                        e.offsetY * canvasScale,
                    )) {
                        activeObjects.clear();
                        activeObjects.add(elm);
                        
                        let oldPos = Vector2 (
                            Math.round(e.offsetX / gridZoom + gridLeft),
                            Math.round(e.offsetY / gridZoom + gridTop)
                        )
                        doCanvasMouseDrag(e, e2 => {
                            let newPos = Vector2 (
                                Math.round(e2.offsetX / gridZoom + gridLeft),
                                Math.round(e2.offsetY / gridZoom + gridTop)
                            )
                            let offset = Vector2 (
                                newPos.x - oldPos.x,
                                newPos.y - oldPos.y
                            )
                            for (let elm of activeObjects) {
                                if (elm instanceof PathDesignElement) for (let node of elm.nodes) {
                                    node.center.x += offset.x;
                                    node.center.y += offset.y;
                                    if (node.bezierP1) {
                                        node.bezierP1.x += offset.x;
                                        node.bezierP1.y += offset.y;
                                    }
                                    if (node.bezierP2) {
                                        node.bezierP2.x += offset.x;
                                        node.bezierP2.y += offset.y;
                                    }
                                }
                            }
                            oldPos = newPos;
                            events.emit("property-update", "cursor", -1);
                        }, () => {
                            events.emit("property-update", "cursor");
                        })
                        
                        path.delete();
                        events.emit("selection-update");
                        return;
                    }
                    path.delete();
                }
            } else if (currentPanes["pane-holder-top"] instanceof panes.lights) {

            }

            // Clicked on nothing 
            if (activeObjects.size) {
                activeObjects.clear();
                events.emit("selection-update");
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