let gameData = {}

function getStartGame() {
    let data = {
        machine: 0,
        machines: [
            {
                type: "segmented",
                prefs: {
                    design: "basic7_1"
                }
            }
        ],
        number: 0,
        res: {
            square: 0,
            pent: 0,
            hex: 0,
        }
    }
    return data;
}

function load() {

    let data = localStorage.getItem("a1a");
    if (!data) {
        gameData = getStartGame()
    } else {
        gameData = deepCopy(JSON.parse(decodeURIComponent(atob(data))), getStartGame())
    }
}

function save() {
    localStorage.setItem("a1a", btoa(encodeURIComponent(JSON.stringify(gameData))))
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
