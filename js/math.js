
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
    return 20;
}

function getGachaCost(machine, pref) {
    let costOffset = 0;
    let gachaCost = machines[machine].prefs[pref].gachaCost;
    return gachaCost[0] + gachaCost[1] * costOffset;
}