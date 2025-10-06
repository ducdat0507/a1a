/** @type {ReturnType<typeof newDesign>} */
let currentDesign = {}

function newDesign() {
    return {
        /** @type {DesignElement[]} */
        design: [
            new PathDesignElement({
                /** @type {PathDesignNode[]} */
                nodes: [
                    { center: Vector2(0, 0) },
                    { center: Vector2(10, 0) },
                    { center: Vector2(10, 4) },
                    { center: Vector2(14, 0) },
                    { center: Vector2(20, 0) },
                    { center: Vector2(20, 20) },
                    { center: Vector2(0, 20) },
                    { center: Vector2(0, 14) },
                    { center: Vector2(4, 10) },
                    { center: Vector2(0, 10) },
                ],

                stroke: { thickness: 2, cap: PathStrokeCap.ROUND, join: PathStrokeJoin.ROUND },
                mayClose: true,
            })
        ],
    }
}

function save() {
    localStorage.setItem("a1a-design", LZString.compressToUTF16(JSON.stringify(currentDesign, itemReplacer)))
}

function load() {
    currentDesign = newDesign();
}