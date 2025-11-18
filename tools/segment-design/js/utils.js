function guid() {
    return crypto.randomUUID();
}

/**
 * 
 * @param {number} value 
 * @param {number} interval 
 * @returns {number}
 */
function snap(value, interval) {
    return Math.round(value / interval) * interval;
}

/**
 * @param {string} str 
 * @param {number} digits 
 * @returns 
 */
function roundSVGString(str, digits) {
    return str.replaceAll(/\d+\.?\d*/g, (x) => (+x).toLocaleString("en-US", {
        maximumFractionDigits: digits,
    }));
}

function format(number) {

}

format.past = function (ms) {
    if (ms < 60000) return "just now";
    ms /= 60000;
    if (ms < 60) return Math.floor(ms) + " minutes ago";
    ms /= 60;
    if (ms < 24) return Math.floor(ms) + " hours ago";
    ms /= 24;
    return Math.floor(ms) + " days ago";
}