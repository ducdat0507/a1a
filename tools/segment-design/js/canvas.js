let canvasScale = 1, canvasWidth = 0, canvasHeight = 0;

let gridLeft = -12.5, gridTop = -12.5, gridZoom = 10;

function setupCanvas() {
    elements.mainCanvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        let factor = 0.9 ** Math.sign(e.deltaY);
        let center = Vector2(
            gridLeft - e.offsetX / gridZoom,
            gridTop - e.offsetY / gridZoom
        )
        gridLeft += (center.x - gridLeft) * (1 - factor);
        gridTop += (center.y - gridTop) * (1 - factor);
        gridZoom *= factor;
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
        }
    });
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

    elements.canvasCtx.lineWidth = canvasScale;
    elements.canvasCtx.font = `${13 * canvasScale}px Arial`;
    elements.canvasCtx.fillStyle = "#fff";

    // Horizontal axis
    let gridBeginX = Math.floor(gridLeft / gridInterval) * gridInterval;
    let gridEndX = gridBeginX + gridInterval * 2 + (canvasWidth / canvasScale / gridZoom);
    
    elements.canvasCtx.textAlign = "center";
    elements.canvasCtx.textBaseline = "top";

    for (let x = gridBeginX; x < gridEndX; x += gridInterval) {
        let screenX = Math.floor((x - gridLeft) * gridZoom * canvasScale) + 0.5;
        elements.canvasCtx.strokeStyle = getColor(x);
        elements.canvasCtx.beginPath();
        elements.canvasCtx.moveTo(screenX, 0);
        elements.canvasCtx.lineTo(screenX, canvasHeight);
        elements.canvasCtx.stroke();
        if (x % gridIntervalMajor == 0) {
            elements.canvasCtx.fillText(x.toString(), screenX, 6 * canvasScale);
        }
    }

    // Vertical axis
    let gridBeginY = Math.floor(gridTop / gridInterval) * gridInterval;
    let gridEndY = gridBeginY + gridInterval * 2 + (canvasHeight / canvasScale / gridZoom);

    elements.canvasCtx.textAlign = "left";
    elements.canvasCtx.textBaseline = "middle";

    for (let y = gridBeginY; y < gridEndY; y += gridInterval) {
        let screenY = Math.floor((y - gridTop) * gridZoom * canvasScale) + 0.5;
        elements.canvasCtx.strokeStyle = getColor(y);
        elements.canvasCtx.beginPath();
        elements.canvasCtx.moveTo(0, screenY);
        elements.canvasCtx.lineTo(canvasWidth, screenY);
        elements.canvasCtx.stroke();
        if (y % gridIntervalMajor == 0) {
            elements.canvasCtx.fillText(y.toString(), 6 * canvasScale, screenY);
        }
    }
}

function drawItems() {
    let scale = gridZoom * canvasScale;
    elements.canvasCtx.lineWidth = canvasScale * 2;
    elements.canvasCtx.lineCap = "round";
    elements.canvasCtx.lineJoin = "round";

    for (let elm of currentDesign.design) {
        elements.canvasCtx.fillStyle = "#7f73";
        elements.canvasCtx.strokeStyle = "#7f7";
        let path = elm.toPath();
        path.transform(
            scale, 0,     -gridLeft * scale,
            0,     scale, -gridTop * scale,
            0, 0, 1
        );
        let path2D = new Path2D(path.toSVGString());

        elements.canvasCtx.fill(path2D, "evenodd");
        elements.canvasCtx.stroke(path2D);
        path.delete();

        if (elm.stroke.thickness) {
            let path = elm.toPath(true);
            path.transform(
                scale, 0,     -gridLeft * scale,
                0,     scale, -gridTop * scale,
                0, 0, 1
            );
            let path2D = new Path2D(path.toSVGString());
            elements.canvasCtx.globalAlpha = 0.3;
            elements.canvasCtx.stroke(path2D);
            elements.canvasCtx.globalAlpha = 1;
            elements.canvasCtx.setLineDash([10 * canvasScale, 5 * canvasScale]);
            elements.canvasCtx.stroke(path2D);
            elements.canvasCtx.setLineDash([]);
            path.delete();
        }
    }
}