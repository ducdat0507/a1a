let infos = {
    help(scroller) {
        let icons = iconsets.tabler.charmap;
        forms.makeHeader("What?");
        forms.makeText(
            `A+1→A is a fidget clicker thing based on the developer's old habit of inputting "A+1→A" on a Casio calculator`
            + ` and pressing the "=" button to increment a counter by one over and over.`
        ).fill = "#fff";

        forms.makeHeader("How?");
        forms.makeText(
            `The gist is to press the "${icons["exposure-plus-1"]}" button at the bottom of the screen to`
            + ` increment the counter at the center by one.`
        ).fill = "#fff";
        forms.makeText(
            `(note that this amount may not be upgraded as the counter's main purpose is to`
            + ` keep track of how many times the "${icons["exposure-plus-1"]}" button is pressed.)`
        );

        forms.makeHeader("Currencies");
        forms.makeText(
            `Progression in A+1→A is handled through the various currencies which are granted when the counter reaches certain milestones.`
            + ` Here are some types of currencies available, their obtaining methods, and use cases:`
        ).fill = "#fff";
        forms.makeText(
            `- ${icons["square-rotated"]} is awarded every time the counter reaches a multiple of 1,000.`
            + ` ${icons["square-rotated"]} is used to obtain cosmetics for your counter.`
        ).fill = "#fff";
        if (gameData.number >= 1e4) {
            forms.makeText(
                `- ${icons["pentagon"]} is awarded every time the counter reaches a multiple of 10,000.`
                + ` ${icons["pentagon"]} is used to purchase new machine mechanics.`
            ).fill = "#fff";
        }
        if (gameData.number >= 1e5) {
            forms.makeText(
                `- ${icons["hexagon"]} is awarded every time the counter reaches a multiple of 100,000.`
                + ` ${icons["hexagon"]} is used to unlock new machines.`
            ).fill = "#fff";
        }
        if (Object.keys(gameData.res.circle).length) {
            forms.makeText(
                `- ${icons["circle"]} is awarded every time you obtain a duplicate cosmetic item.`
                + ` ${icons["circle"]} is used to purchase additional boosts to your currency gains.`
            ).fill = "#fff";
        }

        forms.makeSpace(30);
        forms.registerDynamicFlow(0);
    },
    customize(scroller) {
        let icons = iconsets.tabler.charmap;
        forms.makeHeader("About");
        forms.makeText(
            `The "Customization" menu allows you to customize the appearance of the current counter.`
        ).fill = "#fff";

        forms.makeHeader("Obtaining");
        forms.makeText(
            `Cosmetic items can be obtained by spending ${icons["square-rotated"]} for a random cosmetic of a specific category.`
        ).fill = "#fff";

        forms.makeHeader("Items");
        forms.makeText(
            `In addition to the cosmetic values, each cosmetic item gives bonus ${icons["square-rotated"]} rates based on its worth which is indicated by the number`
            + ` of ${icons["square-rotated"]} or ${icons["square-rotated-filled"]} icons on the item card.`
        ).fill = "#fff";
        
        forms.makeHeader("Roulette and " + icons["circle"]);
        forms.makeText(
            `Items that are worth more than others appears propotionally less often than their counterparts.`
        ).fill = "#fff";
        if (Object.keys(gameData.res.circle).length) {
            forms.makeText(
                `When the roulette lands on a cosmetic item you already have, it is converted to ${icons["circle"]} based on its worth.`
                + ` Additionally, items from certain categories award more ${icons["circle"]} than others.`
            ).fill = "#fff";
        }


        forms.makeSpace(30);
        forms.registerDynamicFlow(0);
    },
    shop(scroller) {
        let icons = iconsets.tabler.charmap;
        forms.makeHeader("About");
        forms.makeText(
            `The "Shop" menu allows you to purchase upgrades of various uses.`
        ).fill = "#fff";

        forms.makeHeader("Purchasing");
        forms.makeText(
            `Shop upgrades can be bought by spending the currency displayed on the shop upgrade card.`
        ).fill = "#fff";
        forms.makeText(
            `Upgrades can be bought either once or multiple times with differing costs and stronger effects for each purchase.`
        ).fill = "#fff";


        forms.makeSpace(30);
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