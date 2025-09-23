function getCurrency(type) {
    switch (type) {
        case "square": return gameData.res.square;
        case "pent": return gameData.res.pent;
        case "hex": return gameData.res.hex;
        case "circle": return gameData.res.circle[getCurrentMachine().type];
    }
}
function addCurrency(type, amount) {
    switch (type) {
        case "square": gameData.res.square += amount;
        case "pent": gameData.res.pent += amount;
        case "hex": gameData.res.hex += amount;
        case "circle": gameData.res.circle[getCurrentMachine().type] += amount;
    }
}

function buyItem(machine, item, update) {
    let data = machines[machine].shop.items[item];
    let amount = gameData.unlocks[machine].items[item] ?? 0;
    let cost = data.costs[amount];
    if (getCurrency(data.costType) >= cost) {
        addCurrency(data.costType, -cost);
        unlocks[machine].items[item] = amount + 1;
        update();
    }
}