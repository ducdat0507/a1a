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
            let bar = controls.rect({
                position: Ex(-220, 190, 0.5, 1),
                size: Ex(100, 100, 0, 0),
                radius: 50,
                fill: "#4f4f4f",
            })

            bar.append(controls.icon({
                position: Ex(0, -50, 0.5, 1),
                scale: 32,
                icon: icon,
                fill: "#000000",
            }), "icon");

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
            
        }

        let bars = [
            makeBar(
                "square-rotated-filled", 
                (gameData.number / 1000 % 1), 
                `${gameData.number % 1000}\n/ 1k`
            ),
            makeBar(
                "pentagon-filled", 
                (Math.floor(gameData.number / 1000 % 10) / 10), 
                `${Math.floor(gameData.number / 1000 % 10)}\n/ 10`
            ),
            makeBar(
                "hexagon-filled", 
                (Math.floor(gameData.number / 10000 % 10) / 10), 
                `${Math.floor(gameData.number / 10000 % 10)}\n/ 10`
            ),
        ];


        for (let i = bars.length - 1; i >= 0; i--) box.append(bars[i]);

        function intro() {
            tween(600, (t) => {
                let buttonRect = targetButton.rect;
                let boxRect = box.rect;
                let startPos = Ex(
                    (buttonRect.x - boxRect.x) / scale,
                    (buttonRect.y - boxRect.y) / scale,
                )
                let offsetStep = 0.3 / bars.length;
                for (let i in bars) {
                    let barTime = Math.min(Math.max(t * 1.3 - (+i + Math.sign(i)) * offsetStep, 0), 1);
                    lerpBarPos(bars[i], +i, ease.back.out(barTime) ** 0.5, startPos);
                    if (i != 0) bars[i].alpha = barTime ** 0.1;
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
                    let barTime = Math.min(Math.max(t * 1.3 - 0.1 + i * offsetStep, 0), 1);
                    lerpBarPos(bars[i], +i, 1 - ease.cubic.out(barTime), startPos);
                    if (i != 0) bars[i].alpha = barTime ** 0.1;
                }
            })
        }

        intro();

        return popup;
    }
}