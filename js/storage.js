let gameData = {}

function getStartGame() {
    let data = {
        number: 0,
        res: {
            square: 0,
            pent: 0,
            hex: 0,
        },

        machine: 0,
        machines: [
            {
                type: "segmented",
                prefs: {
                    design: "basic7_1"
                }
            }
        ],

        prefs: {
            maxRes: 0,
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
            gameData = deepCopy(JSON.parse(decodeURIComponent(atob(data))), getStartGame())
        } else {
            gameData = deepCopy(JSON.parse(LZString.decompressFromUTF16(data)), getStartGame())
        }
    } catch (e) {
        console.warn("Save loading encountered an error: \n", e);
    }
}

function save() {
    localStorage.setItem("a1a", LZString.compressToUTF16(JSON.stringify(gameData)))
}

function downloadSave() {
    let text = LZString.compressToUTF16(JSON.stringify(gameData))
    
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
        if (target[item] === undefined) target[item] = source[item];
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}
