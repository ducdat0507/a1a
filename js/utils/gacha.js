function getGachaWeights(machine, pref) {
    let data = typeof pref == "object"
        ? pref
        : machines[machine].prefs[pref].items();

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

    let unlocks = gameData.unlocks[machine].prefs[pref];
    let unlocksOld = new Set(gameData.unlocks[machine].prefs[pref]);

    if (unlocks.has(target)) {
        gameData.res.circle[machine] ||= 0;
        gameData.res.circle[machine] += itemData[target].worth * data.circleFactor;
    } else {
        unlocks.add(target);
    }

    const itemsPerRow = data.gachaItemsPerRow;
    const itemGap = 10;
    const itemHeight = data.gachaItemHeight;
    const itemsWidth = 560;

    let background = controls.rect({
        position: Ex(0, 0),
        size: Ex(0, 0, 1, 1),
        fill: "#0000",
    })
    scene.append(background);
    
    let itemHolder = controls.rect({
        position: Ex(-400, -itemHeight / 2 + 10, 0.5, 0.5),
        size: Ex(800, itemHeight + 20, 0, 0),
        radius: itemHeight / 2,
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
        position: Ex(-6, -300 - itemHeight / 2, 0.5, 0.5),
        fill: "#3f3f3f",
        icon: "arrow-down",
        scale: 860,
    }), "iconDown")
    background.append(controls.icon({
        position: Ex(-6, 334 + itemHeight / 2, 0.5, 0.5),
        fill: "#3f3f3f",
        icon: "arrow-up",
        scale: 860,
    }), "iconUp")


    let spawnItemPos = 0;
    let scrolledItemPos = 0;

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
            let button = data.toGachaItem(itemId, data.makeItem(itemId, itemData[itemId]), unlocksOld);
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
            itemHolder.radius = lerp(itemHeight / 2, 20, ease1);
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

function doGachaAnimationWithCategories(machine, pref, body, onDecide) {
    let data = machines[machine].prefs[pref];
    let itemData = data.items();

    let itemsToScroll = Math.floor(Math.random() * 16 + 40);
    let scrollDuration = (Math.random() * 0.2 + 0.9) * Math.log(itemsToScroll) * 1500;
    let scrollOffset = (Math.random() - 0.5) * 0.8;

    let targetCategories = Object.keys(data.categories);
    targetCategories = targetCategories.filter(x => !data.categories[x].unlocked || data.categories[x].unlocked());
    let targetCategory = targetCategories[Math.floor(Math.random() * targetCategories.length)];

    let weights = getGachaWeights(machine, itemData[targetCategory]);
    let target = gachaPref(weights);

    let unlocks = gameData.unlocks[machine].prefs[pref][targetCategory];
    let unlocksOld = new Set(gameData.unlocks[machine].prefs[pref][targetCategory]);

    if (unlocks.has(target)) {
        gameData.res.circle[machine] ||= 0;
        gameData.res.circle[machine] += itemData[targetCategory][target].worth * data.circleFactor;
    } else {
        unlocks.add(target);
    }


    
    const itemsPerRow = data.gachaItemsPerRow;
    const itemGap = 10;
    const itemHeight = data.gachaItemHeight;
    const itemsWidth = 560;

    let background = controls.rect({
        position: Ex(0, 0),
        size: Ex(0, 0, 1, 1),
        fill: "#0000",
    })
    scene.append(background);
    
    let itemHolder = controls.rect({
        position: Ex(-400, -itemHeight / 2 + 10, 0.5, 0.5),
        size: Ex(800, itemHeight + 20, 0, 0),
        radius: itemHeight / 2,
        mask: true,
        clickthrough: true,
        fill: "#0000",
    })
    background.append(itemHolder);
    
    let itemBox = controls.base({
        position: Ex(0, 0, 0.5, 0.5),
    })
    itemHolder.append(itemBox);
    
    background.append(controls.icon({
        position: Ex(-6, -300 - itemHeight / 2, 0.5, -0.5),
        fill: "#3f3f3f",
        icon: "arrow-down",
        scale: 860,
    }), "iconDown")
    background.append(controls.icon({
        position: Ex(-6, 334 + itemHeight / 2, 0.5, 1.5),
        fill: "#3f3f3f",
        icon: "arrow-up",
        scale: 860,
    }), "iconUp")
    
    let categoryHolder = controls.rect({
        position: Ex(-250, -32, 0.5, 0.5),
        size: Ex(500, 64, 0, 0),
        radius: 20,
        mask: true,
        clickthrough: true,
        fill: "#2f2f2f",
    })
    background.append(categoryHolder);
    let categoryLabel = controls.label({
        position: Ex(0, 0, 0.5, 0.5),
        scale: 32,
    })
    categoryHolder.append(categoryLabel);



    let spawnItemPos = 0;
    let scrolledItemPos = 0;

    tween(1000, (t) => {
        let ease1 = ease.cubic.out(t);
        background.fill = "#000000" + Math.floor(ease1 * 192).toString(16).padStart(2, "0");
    })
    return tween(600, (t) => {
        let displayedCategory = targetCategories[Math.floor(Math.random() * targetCategories.length)];
        categoryLabel.text = data.categories[displayedCategory].title;
    }).then(() => {
        let displayedCategory = targetCategory;
        categoryLabel.text = data.categories[displayedCategory].title;
        tween(1500, (t) => {
            let ease1 = ease.cubic.out(t);
            itemHolder.fill = "#0f0f0f" + Math.floor(ease1 * 255).toString(16).padStart(2, "0");
            let ease2 = ease.exp.out(t);
            categoryHolder.position.y = lerp(-32, -120 - itemHeight / 2, ease2);
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
                let button = data.toGachaItem(targetCategory, itemId, data.makeItem(targetCategory, itemId, itemData[targetCategory][itemId]), unlocksOld);
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
        });
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
            itemHolder.radius = lerp(itemHeight / 2, 20, ease1);
            itemBox.position.x = boxPosFrom + (boxPosTo - boxPosFrom) * ease1;
            categoryHolder.position.y = lerp(-120, -70, ease1) - itemHeight / 2;
            background.$iconDown.alpha = background.$iconUp.alpha = 1 - ease1;
        })
    }).then(() => {
        return tween(2000, (t) => {
            let ease1 = ease.exp.in(t);
            background.fill = "#000000" + Math.floor((1 - ease1) * 192).toString(16).padStart(2, "0");
            categoryHolder.position.ey = itemHolder.position.ey = 0.5 - 1 * ease1;
        })
    }).then(() => {
        scene.remove(background);
    })
}