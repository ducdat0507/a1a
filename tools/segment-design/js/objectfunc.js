

/**
 * @template {T}
 * @param {Array<T>} array 
 * @param {Set<T>} items 
 * @param {number} amount 
 */
function moveItems(array, items, amount) {
    const sign = Math.sign(amount) + 1;
    const loopStart = [array.length - 1, 0, 0][sign];
    const loopEnd = [0, array.length - 1][sign];
    const loopCondition = [(a) => a >= 0, (a) => false, (a) => a < array.length][sign];
    const loopDirection = [-1, 0, 1][sign];

    let insertPos = loopStart;
    let maxPos = [items.size - 1, 0, array.length - items.size][sign];
    let origArray = [...array];
    array.fill(null);

    for (let a = loopStart; loopCondition(a); a += loopDirection) {
        const item = origArray[a];
        if (items.has(item)) {
            let newPos = Math[["max", "", "min"][sign]](maxPos, a + amount);
            array[newPos] = item;
            console.log(a, "=>", newPos, maxPos);
            maxPos += loopDirection;
        } else {
            while (array[insertPos] !== null) insertPos += loopDirection;
            array[insertPos] = item;
            console.log(a, "=>", insertPos)
        }
    }

    return array;
}