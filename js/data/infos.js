let infos = {
    about(scroller) {
        forms.makeHeader("what?");
        forms.makeText(
            "A+1→A is a fidget clicker thing base on the developer's old habit of inputting \"A+1→A\" on a Casio calculator"
            + " and pressing the \"=\" button to increment a memory counter by one over and over."
        ).fill = "#fff";

        forms.makeHeader("what's the point?");
        forms.makeText(
            "The point is to act like a fidget toy rather than an incremental game."
        ).fill = "#fff";

        forms.registerDynamicFlow(0);
    },
    credits(scroller) {
        scroller.$content.append(controls.label({
            position: Ex(0, scroller.$content.size.y + 86, 0, 0),
            scale: 172,
            style: "700",
            align: "left",
            text: "A+1→A"
        }))

        scroller.$content.size.y += 160;

        forms.makeText("a fidget clicker thingy", 1);

        scroller.$content.size.y += 40;

        forms.makeSideButton("made by duducat / ducdat0507", () => open("https://duducat.moe", "_blank"), "external-link");
        let source = forms.makeSideButton("with open source", () => callPopup("text", "LICENSE", "License"), "license");
        {
            source.append(controls.button({
                position: Ex(-190, 10, 1, 0),
                size: Ex(110, 60),
                fill: "#3f3f3f",
                radius: 10,
                onClick: () => open("https://github.com/ducdat0507/a1a", "_blank"),
            }), "button2")
            source.$button2.append(controls.label({
                position: Ex(0, 0, .5, .5),
                scale: 40,
                font: "tabler icons",
                text: iconsets.tabler.charmap["brand-github"] + iconsets.tabler.charmap["external-link"],
            }), "icon")
        }

        let donate = forms.makeSideButton("donate button ->", () => open("https://liberapay.com/ducdat0507", "_blank"), "currency-dollar");
        donate.fill = "#221";
        donate.$title.position = Ex(-90, 42, 1, 0);
        donate.$title.align = "right";
        donate.$button.fill = "#552";
        

        forms.makeHeader("Library licenses");
        forms.makeSideButton("Inter", () => callPopup("text", "res/fonts/InterVariable.LICENSE", "License"), "license");
        forms.makeSideButton("lz-string", () => callPopup("text", "js/lib/lz-string.LICENSE", "License"), "license");
        forms.makeSideButton("Tabler Icons", () => callPopup("text", "res/fonts/tabler-icons.LICENSE", "License"), "license");
    }
}