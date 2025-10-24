
/** @type {ReturnType<typeof newData>} */
let currentData = {}
/** @type {ReturnType<typeof newDesign>} */
let currentDesign = {}

function newData() {
    let design = {
        id: crypto.randomUUID(),
        name: "New design",
        lastUpdated: Date.now(),
        design: newDesign()
    }
    return {
        designs: [design],
        currentDesign: design.id
    }
}

function newDesign() {
    return {
        spec: {
            width: 48,
            height: 120,
            charSpace: 10,
            sepSpace: 20,
        },
        /** @type {Record<string, string>} */
        extraSpec: {},
        /** @type {DesignElement[]} */
        design: [],
        /** @type {SegmentWire[]} */
        wires: []
    }
}

function save() {
    currentData.designs.find(x => x.id == currentData.currentDesign).lastUpdated = Date.now();
    localStorage.setItem("a1a-design", LZString.compressToUTF16(JSON.stringify(currentData)))
}

function load() {
    try {
        let tmpObj = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("a1a-design")));
        tmpObj = deepCopy(tmpObj, newData());
        currentData = tmpObj;
        setDesign(currentData.currentDesign);
    } catch (e) {
        console.log(e);
        currentDesign = newDesign();
    }
}

function setDesign(id) {
    currentDesign = currentData.designs.find(x => x.id == id).design;
    fixDesign(currentDesign);
    currentData.currentDesign = id;
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

function fixDesign(design) {
    for (let elm in design.design) {
        design.design[elm] = new PathDesignElement(design.design[elm]);
    }
    for (let elm in design.wires) {
        design.wires[elm] = new SegmentWire(design.wires[elm]);
    }
}