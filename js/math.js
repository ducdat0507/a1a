
function formatFixed(num, sig = 0) {
    let scale = 10 ** sig;
    return (Math.floor(num * scale) / scale).toLocaleString("en-US", {
        maximumFractionDigits: sig,
        minimumFractionDigits: sig,
    }).replace(/,/g, ' ');
}

function lerp(from, to, x) {
    return from + (to - from) * x;
}


function getSquareGain() {
    let gain = 20;
    for (let machine in gameData.unlocks) {
        let unlocks = gameData.unlocks[machine];
        let data = machines[machine];
        for (let pref in unlocks.prefs) {
            let prefItems = data.prefs[pref].items();
            if (prefItems.$composite) {
                for (let category in unlocks.prefs[pref]) {
                    for (let item in unlocks.prefs[pref][category]) {
                        gain += prefItems[category][item].worth || 0;
                    }
                }
            } else {
                for (let item of unlocks.prefs[pref]) {
                    gain += prefItems[item].worth || 0;
                }
            }
        }
    }
    gain += getShopItemEffect("segmented", "squareBoost");
    return gain;
}

function getGachaCost(machine, pref) {
    let costOffset = 0;
    let gachaCost = machines[machine].prefs[pref].gachaCost;
    return gachaCost[0] + gachaCost[1] * costOffset;
}