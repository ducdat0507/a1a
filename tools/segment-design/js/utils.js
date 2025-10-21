function guid() {
    return crypto.randomUUID();
}

/**
 * @param {string} str 
 * @param {number} digits 
 * @returns 
 */
function roundSVGString(str, digits) {
    return str.replaceAll(/\n+\.?\n*/g, (x) => (+x).toLocaleString("en-US", {
        maximumFractionDigits: digits,
    }));
}