function getGachaWeights(machine, pref) {
    let data = machines[machine].prefs[pref].items();

    let total = 0;
    let items = [];

    for (let item in data) {
        if (!data[item].worth) continue;
        total += data[item].worth;
        items.push([item, data[item].worth]);
    }

    return { total, items }
}

function gachaPref(machine, pref) {
    let { total, items } = typeof machine == "object"
        ? machine
        : getGachaWeights(machine, pref);

    let result = Math.random() * total;
    for (let item of items) {
        if (result < item[1]) return item[0];
        result -= item[1];
    } 
}

function doGachaAnimation(machine, pref) {
    let data = machines[machine].prefs[pref];
    let itemData = data.items();

    let itemsToScroll = Math.floor(Math.random() * 16 + 40);
    let scrollDuration = (Math.random() * 0.2 + 0.9) * Math.log(itemsToScroll) * 1500;

    let weights = getGachaWeights(machine, pref);
    let target = gachaPref(weights);

    let background = controls.rect({
        position: Ex(0, 0),
        size: Ex(0, 0, 1, 1),
        fill: "#0000",
    })
    scene.append(background);
    
    let itemHolder = controls.rect({
        position: Ex(-400, -90, 0.5, 0.5),
        size: Ex(800, 180, 0, 0),
        radius: 20,
        mask: true,
        clickthrough: true,
        fill: "#000",
    })
    background.append(itemHolder);
    
    let itemBox = controls.base({
        position: Ex(0, 0, 0.5, 0.5),
    })
    itemHolder.append(itemBox);

    let spawnItemPos = 0;
    let scrolledItemPos = 0;
    const itemsPerRow = 4;
    const itemGap = 10;
    const itemHeight = 160;

    tween(1000, (t) => {
        let ease1 = ease.cubic.out(t);
        background.fill = "#000000" + Math.floor(ease1 * 127).toString(16).padStart(2, "0");
    })
    tween(1500, (t) => {
        let ease1 = ease.cubic.out(t);
        itemHolder.fill = "#0f0f0f" + Math.floor(ease1 * 255).toString(16).padStart(2, "0");
    })
    tween(scrollDuration, (t) => {
        let itemPos = ease.cubic.out(t) * (itemsToScroll + 6) - 6;

        const itemsWidth = 560;
        const itemWidth = (itemsWidth - itemGap * (itemsPerRow - 1)) / itemsPerRow;
        const itemOffset = (itemWidth + itemGap);

        const containerWidth = 780;
        const itemWindow = containerWidth / 2 / itemOffset + 1;
        
        while (spawnItemPos < itemPos + itemWindow) {
            let itemId = spawnItemPos == itemsToScroll ? target : gachaPref(weights);
            let button = data.makeItem(itemId, itemData[itemId]);
            button.position = Ex(
                itemOffset * spawnItemPos - itemWidth / 2,
                -itemHeight / 2, 
                0.5, 0.5
            ),
            button.size = Ex(itemWidth, itemHeight);
            itemBox.append(button);
            spawnItemPos++;
        }
        while (scrolledItemPos < itemPos - itemWindow) {
            itemBox.remove(itemBox.controls[0]);
            scrolledItemPos++;
        }
        itemBox.position.x = -itemOffset * itemPos;
    })
}