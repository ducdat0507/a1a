function doItemReveal(lerpItems) {
    for (let [item, delay] of lerpItems) {
        let y = item.position.y;
        item.alpha = 0;
        setTimeout(() => tween(300, (t) => {
            let value = ease.back.out(t) ** .5;
            item.alpha = t;
            item.position.y = y + 100 * (1 - value);
        }), delay);
    }
}