function gachaPref(machine, pref) {
    let data = machines[machine].prefs[pref].items();

    let total = 0;
    let items = [];

    for (let item in data) {
        if (!data[item].worth) continue;
        total += data[item].worth;
        items.push([item, data[item].worth]);
    }

    let result = Math.random() * total;
    for (let item of items) {
        if (result < item[1]) return item[0];
        result -= item[1];
    }
}

function doGachaAnimation() {
    let itemsToScroll = Math.floor(Math.random() * 21 + 60);
    let scrollDuration = (Math.floor() * 0.2 + 0.9) * Math.log10(itemsToScroll);

    let box = document.
}