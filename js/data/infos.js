let infos = {
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

        forms.makeSideButton("made by duducat", () => open("https://duducat.moe", "_blank"), "external-link");
        let donate = forms.makeSideButton("donate!? ->", () => open("https://liberapay.com/ducdat0507", "_blank"), "currency-dollar");
        donate.fill = "#221";
        donate.$title.position = Ex(-90, 42, 1, 0);
        donate.$title.align = "right";
        donate.$button.fill = "#552";
    }
}