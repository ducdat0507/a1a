let gameData = {}

function getStartGame() {
    let data = {
        version: 1,

        number: 0,
        res: {
            square: 0,
            pent: 0,
            hex: 0,
            circle: {}
        },

        machine: 0,
        machines: [
            {
                type: "segmented",
                prefs: {
                    design: "basic7_1",
                    color: {
                        body: "l0c0",
                        display: "l0c0",
                    }
                }
            }
        ],

        unlocks: Object.fromEntries(Object.keys(machines).map(x => [x, machines[x].unlocks])),

        prefs: {
            maxRes: 0,
            targetFps: 0,
            showFps: false,
        }
    }
    return data;
}

function load() {
    try {
        let data = localStorage.getItem("a1a");
        if (!data) {
            gameData = getStartGame()
        } else if (data.startsWith("J")) {
            let oldData = JSON.parse(decodeURIComponent(atob(data)));
            oldData.version ||= 0;
            fixSave(oldData);
            gameData = deepCopy(oldData, getStartGame())
        } else {
            let oldData = JSON.parse(LZString.decompressFromUTF16(data));
            oldData.version ||= 0;
            fixSave(oldData);
            gameData = deepCopy(oldData, getStartGame())
        }
    } catch (e) {
        console.warn("Save loading encountered an error: \n", e);
    }
}

function save() {
    localStorage.setItem("a1a", LZString.compressToUTF16(JSON.stringify(gameData, itemReplacer)))
}

function downloadSave() {
    let text = LZString.compressToUTF16(JSON.stringify(gameData, itemReplacer))
    
    var element = document.createElement("a");
    element.href = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(text);
    element.download = Date.now() + ".a1a";
    element.click();
}

function uploadSave() {
    var element = document.createElement("input");
    element.type = "file";
    element.accept = ".a1a";
    element.oninput = () => {
        element.files[0]?.text().then((txt) => {
            callPopup("save", txt);
        });
    }
    element.click();
}

function totalDestruction() {
    localStorage.removeItem("a1a");
    save = () => {};
    location.reload();
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) {
            target[item] = source[item];
        } else if (source[item] instanceof Set) {
            if (target[item]?.[Symbol.iterator]) {
                target[item] = new Set(target[item]);
                for (let newItem of source[item]) target[item].add(newItem);
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
function itemReplacer(key, value) {
    if (value instanceof Set) return [...value];
    return value;
}

function fixSave(oldData) {
    if (oldData.version <= 0 && oldData.unlocks) {
        for (let machine in oldData.unlocks) {
            oldData.unlocks[machine] = { prefs: oldData.unlocks[machine] }
        }
    }
    oldData.version = 1;
}