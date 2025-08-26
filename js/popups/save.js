popups.save = {
    make(popup, txt) {
        let save;
        try {
            save = deepCopy(JSON.parse(LZString.decompressFromUTF16(txt)), getStartGame());
        } catch (e) {
            popups.prompt.make(popup, 
                "Invalid Save",
                "The save file failed to load, probably because it's corrupted.",
                [
                    { icon: "arrow-left" }
                ]
            )
            return;
        }
        popups.prompt.make(popup, 
            "Import Save?",
            "Do you want to import this save?\n\n"
                + "This will overwrite your current save!",
            [
                { icon: "x" },
                { icon: "check", right: true },
            ],
            (sel) => {
                if (sel == "check") {
                    localStorage.setItem("a1a", txt);
                    save = () => {};
                    location.reload();
                }
            }
        )
        let statusBox = controls.rect({
            position: Ex(20, -20, 0, 0.5),
            size: Ex(-40, 0, 1, 0.5),
            radius: 20,
            fill: "#000",
        })
        popup.$body.append(statusBox, "status");
        statusBox.append(controls.label({
            position: Ex(25, 48, 0, 0),
            align: "left",
            scale: 40,
            text: "A = "
        }))
        statusBox.append(controls.label({
            position: Ex(-25, 48, 1, 0),
            align: "right",
            scale: 40,
            text: formatFixed(save.number)
        }))
        
    }
}