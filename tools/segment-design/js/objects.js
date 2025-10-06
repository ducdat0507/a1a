/** @import PathKit from "../lib/pathKit.tmp" */

/** @abstract */
class DesignElement {

    constructor(params) {
        if (params) for (let param in params) this[param] = params[param];
    }

    /** @type {DesignElementOperation} */
    operation = DesignElementOperation.ADD;

    /** @type {boolean} */
    mayClose = false;

    /** @type {DesignElementStroke} */
    stroke = { thickness: 0, cap: PathStrokeCap.BUTT, join: PathStrokeJoin.BEVEL };

    /** @abstract */
    /** @returns {PathKit.SkPath} */
    toPathInternal() {}
    toPath(raw = false) {
        let path = this.toPathInternal();
        if (raw) return path;

        if (this.stroke.thickness) {
            path.stroke({
                width: this.stroke.thickness,
                cap: { value: this.stroke.cap },
                join: { value: this.stroke.join },
            });
            path.simplify();
        }

        return path;
    }
}

class PathDesignElement extends DesignElement {

    constructor(params) {
        super();
        if (params) for (let param in params) this[param] = params[param];
    }

    /** @type {PathDesignNode[]} */
    #nodes = [];
    get nodes() { return this.#nodes; }
    set nodes(value) { this.#nodes = value; }

    toPathInternal() {
        let path = PathKit.NewPath();

        path.moveTo(this.#nodes[0].center.x, this.#nodes[0].center.y);

        for (let a = 1; a < this.#nodes.length; a++) {
            let node = this.#nodes[a];
            if (node.bezierP1 || node.bezierP2) {
                let p1 = node.bezierP1 ?? this.#nodes[a - 1].center;
                let p2 = node.bezierP2 ?? this.#nodes[a].center;
                path.cubicTo(p1.x, p1.y, p2.x, p2.y, node.center.x, node.center.y);
            } else {
                path.lineTo(node.center.x, node.center.y);
            }
        }

        if (this.mayClose) {
            let node = this.#nodes[0];
            if (node.bezierP1 || node.bezierP2) {
                let p1 = node.bezierP1 ?? this.#nodes.at(-1).center;
                let p2 = node.bezierP2 ?? this.#nodes[0].center;
                path.cubicTo(p1.x, p1.y, p2.x, p2.y, node.center.x, node.center.y);
            } else {
                path.close();
            }
        }

        return path;
    }
}

/** @enum */
const DesignElementOperation = {
    ADD: 1,
    SUBTRACT: -1,
}
/** @enum */
const PathStrokeCap = {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2,
}
/** @enum */
const PathStrokeJoin = {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2,
}

/**
 * @typedef Vector2
 * @property {Number} x
 * @property {Number} y
 */

/** @returns {Vector2} */
function Vector2(x, y) {
    return { x, y }
}

/**
 * @typedef PathDesignNode
 * @property {Vector2} center
 * @property {Vector2} [bezierP1]
 * @property {Vector2} [bezierP2]
 */

/**
 * @typedef PathDesignNode
 * @property {Vector2} center
 * @property {Vector2} [bezierP1]
 * @property {Vector2} [bezierP2]
 */