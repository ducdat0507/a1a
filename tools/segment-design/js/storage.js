/** @type {ReturnType<typeof newDesign>} */
let currentDesign = {}

function newDesign() {
    return {
        /** @type {DesignElement[]} */
        design: [],
        /** @type {SegmentWire[]} */
        wires: []
    }
}

function save() {
    localStorage.setItem("a1a-design", LZString.compressToUTF16(JSON.stringify(currentDesign)))
}

function load() {
    try {
        let tmpObj = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("a1a-design")));
        tmpObj = deepCopy(tmpObj, newDesign());
        for (let elm in tmpObj.design) {
            tmpObj.design[elm] = new PathDesignElement(tmpObj.design[elm]);
        }
        for (let elm in tmpObj.wires) {
            tmpObj.wires[elm] = new SegmentWire(tmpObj.wires[elm]);
        }
        currentDesign = tmpObj;
    } catch (e) {
        console.log(e);
        currentDesign = newDesign();
    }
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) {
            target[item] = source[item];
        } else if (source[item] instanceof Set) {
            if (target[item]?.[Symbol.iterator]) {
                target[item] = new Set(target[item]);
            } else {
                target[item] = source[item];
            }
        }
        else if (typeof source[item] == "object") {
            target[item] = deepCopy(target[item], source[item]);
        }
    }
    return target;
}