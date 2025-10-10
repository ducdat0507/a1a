/** @type {ReturnType<typeof newDesign>} */
let currentDesign = {}

function newDesign() {
    return {
        /** @type {DesignElement[]} */
        design: [],
        wires: []
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