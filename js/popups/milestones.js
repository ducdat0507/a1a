popups.milestones = {
    make(popup) {

        let targetButton = scene.$machine.$body.$milestoneBtn;
        targetButton.$pop.alpha = 0;
        let targetFill = targetButton.fill;
        targetButton.fill = "black";

        popups.prompt.make(popup, 
            "Milestones",
            null,
            [
                { icon: "arrow-left" },
            ],
            (x) => {
                outro();
                setTimeout(() => {
                    targetButton.fill = targetFill;
                    targetButton.$pop.position.y = 0;
                    targetButton.$pop.alpha = 1;
                }, 290);
            }
        );

        let box = controls.base({
            position: Ex(-280, 100, 0.5, 0),
            size: Ex(560, -220, 0, 1),
        })
        popup.append(box);

        function makeBar(icon, progress, text) {
            let isDotted = icon == "circle-dotted";

            let bar = controls.rect({
                position: Ex(-220, 190, 0.5, 1),
                size: Ex(100, 100, 0, 0),
                radius: 50,
                fill: isDotted ? "#2f2f2f" : "#4f4f4f",
                mask: true,
                _progress: progress,
            })

            bar.append(controls.rect({
                position: Ex(0, 0, 0, 0),
                size: Ex(0, -190, 1, 1),
                fill: "#0007",
            }), "progress");
            bar.$progress.append(controls.rect({
                position: Ex(0, 0, 0, 0),
                size: Ex(0, 0, 1, 1),
                fill: "#ffffff",
            }), "fill");

            bar.append(controls.icon({
                position: Ex(0, -50, 0.5, 1),
                scale: 32,
                icon: icon,
                fill: isDotted ? "#0007" : "#000",
            }), "icon");
            bar.append(controls.label({
                position: Ex(0, -150, 0.5, 1),
                scale: 24,
                align: "center",
                text,
                fill: "#000",
            }), "text");

            return bar;
        }

        function lerpBarPos(bar, index, t, startPos) {
            bar.position = Ex(
                lerp(startPos.x, 140 * index + 80, t),
                lerp(startPos.y, 100, t),
            );
            bar.size = Ex(
                lerp(100, 120, t),
                lerp(100, -200, t),
                0,
                t,
            );
            bar.$progress.size.y = lerp(0, -190, t);
            bar.$progress.size.ey = t;
            if (bar.$icon.$progressCircle) {
                bar.$icon.$progressCircle.radius = 
                bar.$icon.$progressCircle.$fill.radius = 
                bar.$icon.$progressCircle.$top.radius = 
                lerp(32, 200, t);
            }
        }
        function lerpBarContent(bar, t) {
            bar.$text.position.y = lerp(-180, -140, t);
            bar.$icon.position.y = lerp(-50, -60, t);
        }
        function lerpBarProgress(bar, t) {
            bar.$progress.$fill.size.ey = bar._progress * t;
            bar.$progress.$fill.position.ey = 1 - bar.$progress.$fill.size.ey;
        }


        let bars = [
            makeBar(
                "square-rotated-filled", 
                (gameData.number / 1000 % 1), 
                `${gameData.number % 1000}\n/ 1k`
            ),
            makeBar(
                gameData.number >= 1e4 ? "pentagon-filled" : "circle-dotted", 
                (Math.floor(gameData.number / 1000 % 10) / 10), 
                `${Math.floor(gameData.number / 1000 % 10)}\n/ 10`
            ),
        ];
        if (gameData.number >= 1e4) {
            bars.push(makeBar(
                gameData.number >= 1e5 ? "hexagon-filled" : "circle-dotted", 
                (Math.floor(gameData.number / 10000 % 10) / 10), 
                `${Math.floor(gameData.number / 10000 % 10)}\n/ 10`
            ));
        }


        bars[0].$icon.append(controls.arc({
            position: Ex(0, 0, 0.5, 0.5),
            radius: 32,
            thickness: 8,
            stroke: "#0003",
            progress: 1,
        }), "progressCircle")
        bars[0].$icon.$progressCircle.append(controls.arc({
            position: Ex(0, 0, 0.5, 0.5),
            radius: 32,
            thickness: 8,
            progress: bars[0]._progress,
            cap: "round",
            stroke: "#999",
        }), "fill")
        bars[0].$icon.$progressCircle.append(controls.arc({
            position: Ex(0, 0, 0.5, 0.5),
            radius: 32,
            thickness: 8,
            progress: 0.0001,
            cap: "round",
            stroke: "#fff",
        }), "top")
        for (let i = bars.length - 1; i >= 0; i--) box.append(bars[i]);

        function intro() {
            tween(2000, (t) => {
                let buttonRect = targetButton.rect;
                let boxRect = box.rect;
                let startPos = Ex(
                    (buttonRect.x - boxRect.x) / scale,
                    (buttonRect.y - boxRect.y) / scale,
                )
                let offsetStep = 0.3 / bars.length;
                for (let i in bars) {
                    let barPosTime = Math.min(Math.max(t * 3 - (+i + Math.sign(i)) * offsetStep, 0), 1);
                    lerpBarPos(bars[i], +i, ease.back.out(1 - (1 - barPosTime) ** 2) ** 0.5, startPos);
                    let barContentTime = Math.min(Math.max(t * 2 - (+i + Math.sign(i)) * offsetStep, 0), 1);
                    lerpBarContent(bars[i], ease.back.out(barContentTime));
                    let barProgressTime = Math.min(Math.max(t * 1.15 - (+i + Math.sign(i)) * offsetStep / 2, 0), 1);
                    lerpBarProgress(bars[i], ease.elastic.out(barProgressTime) ** 2)
                    if (i != 0) bars[i].alpha = barPosTime ** 0.1 * 1.1;
                }
            })
        }
        function outro() {
            tween(300, (t) => {
                let buttonRect = targetButton.rect;
                let boxRect = box.rect;
                let startPos = Ex(
                    (buttonRect.x - boxRect.x) / scale,
                    (buttonRect.y - boxRect.y) / scale,
                )
                let offsetStep = 0.3 / bars.length;
                for (let i in bars) {
                    let barPosTime = Math.min(Math.max(t * 1.3 - 0.1 + i * offsetStep, 0), 1);
                    lerpBarPos(bars[i], +i, 1 - ease.cubic.out(barPosTime), startPos);
                    let barContentTime = Math.min(Math.max(t * 1.3 - 0.1 + i * offsetStep, 0), 1);
                    lerpBarContent(bars[i], 1 - ease.cubic.out(barContentTime), startPos);
                    if (i != 0) bars[i].alpha = (1 - barPosTime);
                }
            })
        }

        intro();

        return popup;
    }
}