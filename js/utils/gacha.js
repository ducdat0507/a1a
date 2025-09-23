function getGachaWeights(machine, pref) {
    let data = machines[machine].prefs[pref].items();

    let total = 0;
    let items = [];

    for (let item in data) {
        if (!data[item].worth) continue;
        let rarity = 1 / data[item].worth ** 2;
        total += rarity;
        items.push([item, rarity]);
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

function doGachaAnimation(machine, pref, body, onDecide) {
    let data = machines[machine].prefs[pref];
    let itemData = data.items();

    let itemsToScroll = Math.floor(Math.random() * 16 + 40);
    let scrollDuration = (Math.random() * 0.2 + 0.9) * Math.log(itemsToScroll) * 1500;
    let scrollOffset = (Math.random() - 0.5) * 0.8;

    let weights = getGachaWeights(machine, pref);
    let target = gachaPref(weights);


    let unlocks = gameData.unlocks[machine][pref];
    let unlocksOld = new Set(gameData.unlocks[machine][pref]);

    if (unlocks.has(target)) {
        gameData.res.circle[machine] ||= 0;
        gameData.res.circle[machine] += itemData[target].worth * data.circleFactor;
    } else {
        unlocks.add(target);
    }


    let background = controls.rect({
        position: Ex(0, 0),
        size: Ex(0, 0, 1, 1),
        fill: "#0000",
    })
    scene.append(background);
    
    let itemHolder = controls.rect({
        position: Ex(-400, -90, 0.5, 0.5),
        size: Ex(800, 180, 0, 0),
        radius: 90,
        mask: true,
        clickthrough: true,
        fill: "#000",
    })
    background.append(itemHolder);
    
    let itemBox = controls.base({
        position: Ex(0, 0, 0.5, 0.5),
    })
    itemHolder.append(itemBox);
    
    background.append(controls.icon({
        position: Ex(-6, -390, 0.5, 0.5),
        fill: "#3f3f3f",
        icon: "arrow-down",
        scale: 860,
    }), "iconDown")
    background.append(controls.icon({
        position: Ex(-6, 384, 0.5, 0.5),
        fill: "#3f3f3f",
        icon: "arrow-up",
        scale: 860,
    }), "iconUp")


    let spawnItemPos = 0;
    let scrolledItemPos = 0;
    const itemsPerRow = 4;
    const itemGap = 10;
    const itemHeight = 160;
    const itemsWidth = 560;

    tween(1000, (t) => {
        let ease1 = ease.cubic.out(t);
        background.fill = "#000000" + Math.floor(ease1 * 192).toString(16).padStart(2, "0");
    })
    tween(1500, (t) => {
        let ease1 = ease.cubic.out(t);
        itemHolder.fill = "#0f0f0f" + Math.floor(ease1 * 255).toString(16).padStart(2, "0");
        let ease2 = ease.exp.out(t);
        background.$iconDown.position.ey = -0.5 + ease2;
        background.$iconUp.position.ey =    1.5 - ease2;
    })
    return tween(scrollDuration, (t) => {
        let itemPos = ease.cubic.out(t) * (itemsToScroll + 6 + scrollOffset) - 6;

        const itemWidth = (itemsWidth - itemGap * (itemsPerRow - 1)) / itemsPerRow;
        const itemOffset = (itemWidth + itemGap);

        const containerWidth = 780;
        const itemWindow = containerWidth / 2 / itemOffset + 1;
        
        while (spawnItemPos < itemPos + itemWindow) {
            let itemId = spawnItemPos == itemsToScroll ? target : gachaPref(weights);
            let item = itemData[itemId];
            let button = data.makeItem(itemId, itemData[itemId]);
            let unlocked = unlocksOld.has(itemId);
            if (unlocked) {
                button.$status.fill = "#fff";
                button.$status.text = iconsets.tabler.charmap["circle-filled"].repeat(item.worth);
            } else {
                button.$status.fill = "#9f5";
                button.$status.text = iconsets.tabler.charmap["square-rotated-filled"].repeat(item.worth);
            }
            button._isMain = spawnItemPos == itemsToScroll;
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
    }).then(() => {
        onDecide?.();

        const itemWidth = (itemsWidth - itemGap * (itemsPerRow - 1)) / itemsPerRow;
        const itemOffset = (itemWidth + itemGap);

        const boxPosFrom = itemBox.position.x;
        const boxPosTo = -itemOffset * itemsToScroll;

        body._updateStatus?.();

        return tween(1000, (t) => {
            let ease1 = ease.exp.out(t) ** 0.5;
            itemHolder.fill = "#" + Math.floor(15 + ease1 * 64).toString(16).padStart(2, "0").repeat(3);
            itemHolder.size.x = 800 - (800 - itemWidth - itemGap * 2) * ease1;
            itemHolder.position.x = -itemHolder.size.x / 2;
            itemHolder.radius = 90 - 70 * ease1;
            itemBox.position.x = boxPosFrom + (boxPosTo - boxPosFrom) * ease1;
            background.$iconDown.alpha = background.$iconUp.alpha = 1 - ease1;
        })
    }).then(() => {
        return tween(2000, (t) => {
            let ease1 = ease.exp.in(t);
            background.fill = "#000000" + Math.floor((1 - ease1) * 192).toString(16).padStart(2, "0");
            itemHolder.position.ey = 0.5 - 1 * ease1;
        })
    }).then(() => {
        scene.remove(background);
    })
}