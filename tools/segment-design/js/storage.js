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
            }),

            new PathDesignElement({
                /** @type {PathDesignNode[]} */
                nodes: [
                    { center: Vector2(22, 0) },
                    { center: Vector2(42, 0) },
                    { center: Vector2(42, 10) },
                    { center: Vector2(32, 20) },
                    { center: Vector2(22, 20) },
                ],

                mayClose: true,
            })
        ],
    }
}

function save() {
    localStorage.setItem("a1a-design", LZString.compressToUTF16(JSON.stringify(currentDesign)))
}

function load() {
    try {
        let tmpObj = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("a1a-design")));
        for (let elm in tmpObj.design) {
            tmpObj.design[elm] = new PathDesignElement(tmpObj.design[elm]);
        }
        currentDesign = tmpObj;
    } catch (e) {
        console.log(e);
        currentDesign = newDesign();
    }
}