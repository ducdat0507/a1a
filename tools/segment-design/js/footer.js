/** @type {Record<string, HTMLDivElement & { $icon: HTMLElement, $value: HTMLDivElement }>} */
const footerStats = {}

function setupFooter() {
    setFooterStat("mousePos", "tabler:pointer", "0 0");
    elements.mainCanvas.addEventListener("pointerleave", () => setFooterStat("mousePos", "tabler:pointer", "-- --"))

    events.on("selection-update", updateFooterBounds);
    events.on("property-update", updateFooterBounds);
}

function updateFooterBounds() {
    let topLeft = Vector2(Infinity, Infinity);
    let bottomRight = Vector2(-Infinity, -Infinity);

    /**
     * @param {Vector2} point 
     */
    function addPoint(point) {
        topLeft.x = Math.min(topLeft.x, point.x);
        bottomRight.x = Math.max(bottomRight.x, point.x);
        topLeft.y = Math.min(topLeft.y, point.y);
        bottomRight.y = Math.max(bottomRight.y, point.y);
    }

    for (let item of activeObjects) {
        if (item instanceof PathDesignElement) {
            for (let node of item.nodes) {
                addPoint(node.center);
                if (node.bezierP1) addPoint(node.bezierP1);
                if (node.bezierP2) addPoint(node.bezierP2);
            }
        } else if (item instanceof SegmentWire) {
            addPoint(item.position);
        }
    }

    let hasPos = isFinite(topLeft.x);
    let hasSize = bottomRight.x - topLeft.x > 0 || bottomRight.y - topLeft.y > 0;
    
   if (hasPos) {
        setFooterStat("topLeft", "tabler:box-align-top-left", `${topLeft.x} ${topLeft.y}`);
    } else {
        setFooterStat("topLeft");
    }
    
    if (hasSize) {
        setFooterStat("size", "tabler:square", `${bottomRight.x - topLeft.x} ${bottomRight.y - topLeft.y}`);
    } else {
        setFooterStat("size");
    }
}

function setFooterStat(key, icon, value) {
    if (value) {
        if (footerStats[key]) {
            footerStats[key].$icon.icon = icon;
            footerStats[key].$value.innerText = value;
        } else {
            let elm = $make.div();
            elm.append(
                elm.$icon = $icon(icon),
                elm.$value = $make.div({}, value)
            )
            elements.footerStats.append(elm);
            footerStats[key] = elm;
        }
    } else {
        if (footerStats[key]) {
            footerStats[key].remove();
            delete footerStats[key];
        }
    }
}