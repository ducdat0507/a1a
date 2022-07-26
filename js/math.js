function formatFixed(num, sig = 0) {
    let scale = 10 ** sig;
    return (Math.floor(num * scale) / scale).toLocaleString("en-US", {
        maximumFractionDigits: sig,
        minimumFractionDigits: sig,
    }).replace(/,/g, ' ');
}