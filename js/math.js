
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
        for (let pref in data.unlocks.prefs) {
            let prefItems = data.prefs[pref].items();
            if (data.prefs[pref].categories) {
                for (let category in data.prefs[pref].categories) {
                    for (let item of unlocks.prefs[pref][category]) {
                        gain += prefItems[category][item]?.worth || 0;
                    }
                }
            } else {
                for (let item of unlocks.prefs[pref]) {
                    gain += prefItems[item]?.worth || 0;
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

const d50White = {
    x: 0.9642956764295677,  // 0.3457 / 0.3585
    y: 1,                   // 1
    z: 0.8251046025104602   // (1.0 - 0.3457 - 0.3585) / 0.35
}
const d65White = {
    x: 0.9504559270516716, // 0.3127 / 0.3290,
    y: 1,                  // 1.00000
    z: 1.0890577507598784  // (1.0 - 0.3127 - 0.3290) / 0.3290
};

const supportsLch = window.CSS.supports("color", "lch(0 0 0)");

function lch(lum, chr, hue, white = d65White) {
    if (supportsLch) return `lch(${lum} ${chr} ${hue})`

    const deg2rad = 0.017453292519943295 // Math.PI / 180

    // Convert LCH(ab) to Lab
    const la = chr * Math.cos(hue * deg2rad);
    const lb = chr * Math.sin(hue * deg2rad);

    // Convert Lab to XYZ
    const epsilon = 0.008856451679035631 // 216 / 24389
    const epsilonCbrt = 0.20689655172413796 // cbrt(epsilon)
    const kappa = 903.2962962962963 // 24389 / 27

    const fy = (lum + 16) / 116
    const fx = la / 500 + fy
    const fz = fy - lb / 200

    const x = (fx > epsilonCbrt
            ? fx * fx * fx
            : (116 * fx - 16) / kappa
        ) * white.x
    const y = (lum > kappa * epsilon
            ? ((lum + 16) / 116) ** 3
            : lum / kappa
        ) * white.y
    const z = (fz > epsilonCbrt
            ? fz * fz * fz
            : (116 * fz - 16) / kappa
        ) * white.z

    // Convert XYZ to linear RGB
    const rLin =  3.2404542 * x +   -1.5371385 * y +   -0.4985314 * z;
    const gLin = -0.9692660 * x +    1.8760108 * y +    0.0415560 * z;
    const bLin =  0.0556434 * x +   -0.2040259 * y +    1.0572252 * z;

    // Convert linear RGB to sRGB
    const r = rLin < 0.0031308 ? 12.92 * rLin : 1.055 * rLin ** (1 / 2.4) - 0.055;
    const g = gLin < 0.0031308 ? 12.92 * gLin : 1.055 * gLin ** (1 / 2.4) - 0.055;
    const b = bLin < 0.0031308 ? 12.92 * bLin : 1.055 * bLin ** (1 / 2.4) - 0.055;

    return `rgb(${r * 255} ${g * 255} ${b * 255})`
}