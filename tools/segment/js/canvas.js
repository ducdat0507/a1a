let canvasScale = 1, canvasWidth = 0, canvasHeight = 0;

let gridLeft = -12.5, gridTop = -12.5, gridZoom = 10;

function updateCanvas() {
    canvasScale = window.devicePixelRatio;
    canvasWidth = elements.mainCanvas.width = elements.mainCanvas.offsetWidth * canvasScale;
    canvasHeight = elements.mainCanvas.height = elements.mainCanvas.offsetHeight * canvasScale;

    elements.canvasCtx.fillStyle = "#111214";
    elements.canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawGrid();
}

function drawGrid() 
{
    let gridInterval = 2;
    let gridIntervalMajor = gridInterval * 5;
    function getColor(pos) {
        if (pos == 0) return "#fff";
        if (pos % gridIntervalMajor == 0) return "#fff4";
        return "#fff2";
    }

    elements.canvasCtx.lineWidth = canvasScale;
    elements.canvasCtx.font = `${12 * canvasScale}px Arial`;
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
            elements.canvasCtx.fillText(x.toString(), screenX, 4 * canvasScale);
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
            elements.canvasCtx.fillText(y.toString(), 4 * canvasScale, screenY);
        }
    }
}