let canvasScale = 1, canvasWidth = 0, canvasHeight = 0;

let gridLeft = -12.5, gridTop = -12.5, gridZoom = 10;
let previewNumber = 0;

function setupCanvas() {
    elements.mainCanvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        let factor = 1.1 ** Math.sign(e.deltaY);
        let center = Vector2(
            gridLeft - e.clientX / gridZoom,
            gridTop - e.offsetY / gridZoom
        )
        gridLeft += (center.x - gridLeft) * (factor - 1);
        gridTop += (center.y - gridTop) * (factor - 1);
        gridZoom /= factor;
        updateCanvas();
    });
    elements.mainCanvas.addEventListener("pointerdown", (e) => {
        console.log(e.button);
        if (e.button == 1) {
            e.preventDefault();
            elements.mainCanvas.style.cursor = "grabbing";
            doCanvasMouseDrag(e, (e2) => {
                gridLeft -= e2.movementX / gridZoom;
                gridTop -= e2.movementY / gridZoom;
                updateCanvas();
            }, () => {
                elements.mainCanvas.style.cursor = "";
            })
        } else {
            currentTool?.onPointerDown(e);
        }
    });

    events.on("selection-update", updateCanvas);
    events.on("property-update", updateCanvas);
}

/** 
 * @param {PointerEvent} event 
 * @param {(this: HTMLCanvasElement, ev: PointerEvent) => any} handler 
 * @param {(this: HTMLCanvasElement, ev: PointerEvent) => any } [handlerUp]
 */
function doCanvasMouseDrag(event, handler, handlerUp) {
    function upHandler(e) {
        handlerUp?.(e);
        elements.mainCanvas.removeEventListener("pointermove", handler);
        elements.mainCanvas.removeEventListener("pointerup", upHandler);
    }
    elements.mainCanvas.addEventListener("pointermove", handler);
    elements.mainCanvas.addEventListener("pointerup", upHandler);
    elements.mainCanvas.setPointerCapture(event.pointerId);
}

function updateCanvas() {
    canvasScale = window.devicePixelRatio;
    canvasWidth = elements.mainCanvas.width = elements.mainCanvas.offsetWidth * canvasScale;
    canvasHeight = elements.mainCanvas.height = elements.mainCanvas.offsetHeight * canvasScale;

    elements.canvasCtx.fillStyle = "#111214";
    elements.canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawGrid();
    drawItems();
    currentTool?.drawGizmos();
}

function drawGrid() 
{
    let gridInterval = 2;
    let gridIntervalMajor = gridInterval * 5;
    function getColor(pos) {
        if (pos == 0) return "#fffa";
        if (pos % gridIntervalMajor == 0) return "#fff3";
        return "#fff1";
    }
    function putVerticalLine(x) {
        let screenX = Math.round((x - gridLeft) * gridZoom * canvasScale) + 0.5;
        elements.canvasCtx.beginPath();
        elements.canvasCtx.moveTo(screenX, 0);
        elements.canvasCtx.lineTo(screenX, canvasHeight);
    }

    function putHorizontalLine(y) {
        let screenY = Math.round((y - gridTop) * gridZoom * canvasScale) + 0.5;
        elements.canvasCtx.beginPath();
        elements.canvasCtx.moveTo(0, screenY);
        elements.canvasCtx.lineTo(canvasWidth, screenY);
    }

    elements.canvasCtx.lineWidth = canvasScale;
    elements.canvasCtx.font = `${13 * canvasScale}px Arial`;
    elements.canvasCtx.fillStyle = "#fff";

    // Horizontal axis
    let gridBeginX = Math.floor(gridLeft / gridInterval) * gridInterval;
    let gridEndX = gridBeginX + gridInterval * 2 + (canvasWidth / canvasScale / gridZoom);
    
    elements.canvasCtx.textAlign = "center";
    elements.canvasCtx.textBaseline = "top";

    for (let x = gridBeginX; x < gridEndX; x += gridInterval) {
        elements.canvasCtx.strokeStyle = getColor(x);
        putVerticalLine(x);
        elements.canvasCtx.stroke();
        if (x % gridIntervalMajor == 0) {
            let screenX = Math.round((x - gridLeft) * gridZoom * canvasScale) + 0.5;
            elements.canvasCtx.fillText(x.toString(), screenX, 6 * canvasScale);
        }
    }

    // Vertical axis
    let gridBeginY = Math.floor(gridTop / gridInterval) * gridInterval;
    let gridEndY = gridBeginY + gridInterval * 2 + (canvasHeight / canvasScale / gridZoom);

    elements.canvasCtx.textAlign = "left";
    elements.canvasCtx.textBaseline = "middle";

    for (let y = gridBeginY; y < gridEndY; y += gridInterval) {
        elements.canvasCtx.strokeStyle = getColor(y);
        putHorizontalLine(y);
        elements.canvasCtx.stroke();
        if (y % gridIntervalMajor == 0) {
            let screenY = Math.round((y - gridTop) * gridZoom * canvasScale) + 0.5;
            elements.canvasCtx.fillText(y.toString(), 6 * canvasScale, screenY);
        }
    }

    // Judges 
    elements.canvasCtx.setLineDash([15 * canvasScale, 5 * canvasScale, 5 * canvasScale, 5 * canvasScale]);
    elements.canvasCtx.strokeStyle = "#8f8";
    putHorizontalLine(currentDesign.spec.height);
    elements.canvasCtx.stroke();
    putVerticalLine(currentDesign.spec.width);
    elements.canvasCtx.stroke();
    elements.canvasCtx.setLineDash([5 * canvasScale, 5 * canvasScale]);
    elements.canvasCtx.strokeStyle = "#fff8";
    putVerticalLine(currentDesign.spec.width + currentDesign.spec.charSpace);
    elements.canvasCtx.stroke();
    putVerticalLine(currentDesign.spec.width + currentDesign.spec.sepSpace);
    elements.canvasCtx.stroke();

    elements.canvasCtx.setLineDash([]);
}

function drawItems() {
    let scale = gridZoom * canvasScale;
    elements.canvasCtx.lineCap = "round";
    elements.canvasCtx.lineJoin = "round";

    let totalPathBuilder = new PathKit.SkOpBuilder();
    let totalPath;

    for (let elm of currentDesign.design) {
        elements.canvasCtx.strokeStyle = elm.operation == DesignElementOperation.SUBTRACT ? "#f88" : "#7f7";
        let path = elm.toPath();
        totalPathBuilder.add(path, elm.operation == DesignElementOperation.SUBTRACT ? PathKit.PathOp.DIFFERENCE : PathKit.PathOp.UNION)
        transformPathToCanvas(path, scale);
        let path2D = path.toPath2D();

        let active = activeObjects.has(elm)

        if (currentPanes["pane-holder-top"] instanceof panes.design) {
            
            elements.canvasCtx.lineWidth = canvasScale * (1 + active * !elm.stroke.thickness);
            elements.canvasCtx.stroke(path2D);

            if (elm.stroke.thickness) {
                let path = elm.toPath(true);
                transformPathToCanvas(path, scale);
                let path2D = path.toPath2D();
                elements.canvasCtx.lineWidth = canvasScale * (1 + active);
                elements.canvasCtx.globalAlpha = 0.3;
                elements.canvasCtx.stroke(path2D);
                elements.canvasCtx.globalAlpha = 1;
                elements.canvasCtx.setLineDash([10 * canvasScale, 5 * canvasScale]);
                elements.canvasCtx.stroke(path2D);
                elements.canvasCtx.setLineDash([]);
                path.delete();
            }
        }

        path.delete();
    }

    if (currentPanes["pane-holder-top"] instanceof panes.design) {
        elements.canvasCtx.fillStyle = "#7f73";
        totalPath = totalPathBuilder.make();
        console.log(totalPath.toSVGString());
        transformPathToCanvas(totalPath, scale);
        let totalPath2D = totalPath.toPath2D();
        elements.canvasCtx.fill(totalPath2D);
    } else if (currentPanes["pane-holder-top"] instanceof panes.lights) {
        totalPath = totalPathBuilder.make();;
        transformPathToCanvas(totalPath, scale);

        let totalPaths = [...totalPath.toSVGString().matchAll(/M[^Z]*Z?/gi)].map(x => x[0])
        let totalPaths2D = totalPaths.map(x => new Path2D(x));

        let wiring = new Array(totalPaths2D.length).fill("").map(x => []);

        for (let wire of currentDesign.wires) {
            let canvasPos = Vector2(
                (wire.position.x - gridLeft) * gridZoom,
                (wire.position.y - gridTop) * gridZoom
            );

            for (let index in totalPaths2D) {
                let path = totalPaths2D[index];
                if (elements.canvasCtx.isPointInPath(path, canvasPos.x, canvasPos.y, "nonzero")) 
                {
                    wiring[index].push(wire);
                    break;
                }
            }
        }

        console.log(wiring);
        
        for (let index in totalPaths2D) {
            let path = totalPaths2D[index];
            if (wiring[index].length == 1) {
                elements.canvasCtx.fillStyle = wiring[index][0].digits[previewNumber] ? "#fffc" : "#fff3";
                elements.canvasCtx.strokeStyle = "#fff";
            } else {
                elements.canvasCtx.fillStyle = "#f773";
                elements.canvasCtx.strokeStyle = "#f77";
            }
            elements.canvasCtx.stroke(path);
            elements.canvasCtx.fill(path);
        }
    }

    totalPathBuilder.delete();
    totalPath?.delete();
}

function transformPathToCanvas(path, scale = null) {
    scale = gridZoom * canvasScale;
    path.transform(
        scale, 0,     -gridLeft * scale,
        0,     scale, -gridTop * scale,
        0, 0, 1
    );
}

function getAllSegments() {
    let totalPathBuilder = new PathKit.SkOpBuilder();
    for (let elm of currentDesign.design) {
        let path = elm.toPath();
        totalPathBuilder.add(path, elm.operation == DesignElementOperation.SUBTRACT ? PathKit.PathOp.DIFFERENCE : PathKit.PathOp.UNION);
        path.delete();
    }

    let totalPath = totalPathBuilder.make();
    let totalPaths = [...totalPath.toSVGString().matchAll(/M[^Z]*Z?/gi)].map(x => x[0]);
    totalPath.delete();

    return totalPaths;
}