let animations = [];

function startAnimation(func) {
    animations.push({
        func,
        time: 0,
    })
    func(0);
}

function tween(duration, func) {
    let doneFunc;
    let promise = new Promise((r) => { doneFunc = r });
    animations.push({
        func: (x) => {
            let interrupt = func(Math.min(x / duration, 1));
            if (x >= duration || interrupt) {
                doneFunc();
            }
            return x >= duration || interrupt;
        },
        time: 0,
    })
    func(0);
    return promise;
}


function updateAnimations() {
    for (let a = 0; a < animations.length; a++) {
        let data = animations[a];
        data.time += delta;
        if (data.func(data.time)) {
            animations.splice(a, 1);
            a--;
        }
    }
}

function makeEase(func) {
    return {
        in: x => func(x),
        out: x => 1 - func(1 - x),
        inout: x => x < 0.5 ? func(x * 2) / 2 : (1 - func(2 - x * 2)) / 2 + .5
    }
}

let ease = {
    linear: makeEase(x => x),
    quad: makeEase(x => x ** 2),
    cubic: makeEase(x => x ** 3),
    quart: makeEase(x => x ** 4),
    quint: makeEase(x => x ** 5),
    exp: makeEase(x => Math.pow(1e-4, 1 - x) - 1e-4 * (1 - x)),
    elastic: makeEase(x => (x == 0 ? 0 : x == 1 ? 1 : Math.sin((x * 10 - 10.75) * (2 * Math.PI) / 3))),
    back: makeEase(x => 2.70158 * x ** 3 - 1.70158 * x * x),
}