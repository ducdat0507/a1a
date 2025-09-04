
let forms = {
    __scroller: null,

    beginForms(scroller) {
        this.__scroller = scroller;
    },
    doneForms() {
        this.__scroller.$content.size.y -= 10;
        this.__scroller = null;
    },

    makeHeader(title) {
        let ctrl;
        this.__scroller.$content.append(ctrl = controls.label({
            position: Ex(1, this.__scroller.$content.size.y + 70, 0, 0),
            scale: 32,
            style: "700",
            align: "left",
            text: title,
        }));

        this.__scroller.$content.size.y += 100;
        return ctrl;
    },

    makeText(content, lines) {
        let ctrl;

        this.__scroller.$content.append(ctrl = controls.label({
            position: Ex(0, this.__scroller.$content.size.y + 18, 0, 0),
            size: Ex(0, 0, 1, 0),
            scale: 24,
            align: "left",
            text: content,
            fill: "#fffa",
            wrap: true,
        }))

        this.__scroller.$content.size.y += 24 * 1.3 * lines + 20;
        return ctrl;
    },

    makeButton(title, onClick, icon = null) {
        let ctrl;
        this.__scroller.$content.append(ctrl = controls.button({
            position: Ex(0, this.__scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#3f3f3f",
            radius: 20,
            onClick
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        if (icon) {
            ctrl.append(controls.icon({
                position: Ex(-40, 40, 1, 0),
                scale: 40,
                icon
            }), "icon")
        }

        this.__scroller.$content.size.y += 90;
        return ctrl;
    },

    makeSideButton(title, onClick, icon = null) {
        let ctrl;
        this.__scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, this.__scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#1f1f1f",
            radius: 20,
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        ctrl.append(controls.button({
            position: Ex(-70, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick,
        }), "button")
        ctrl.$button.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon,
        }), "icon")

        this.__scroller.$content.size.y += 90;
        return ctrl;
    },

    makeCheckbox(title, getValue, onChange) {
        let ctrl;
        this.__scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, this.__scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#1f1f1f",
            radius: 20,
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        ctrl.append(controls.button({
            position: Ex(-70, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(!ctrl.$check.$icon.alpha, update);
                update(); save();
            }
        }), "check")
        ctrl.$check.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "check",
        }), "icon")

        function update() {
            ctrl.$check.$icon.alpha = getValue() ? 1 : 0;
        }
        update();

        this.__scroller.$content.size.y += 90;
        return ctrl;
    },

    makePlusMinus(title, getValue, onChange) {
        let ctrl;
        this.__scroller.$content.append(ctrl = controls.rect({
            position: Ex(0, this.__scroller.$content.size.y),
            size: Ex(0, 80, 1, 0),
            fill: "#1f1f1f",
            radius: 20,
        }))

        ctrl.append(controls.label({
            position: Ex(25, 42, 0, 0),
            scale: 28,
            align: "left",
            text: title,
        }), "title")

        ctrl.append(controls.rect({
            position: Ex(-270, 10, 1, 0),
            size: Ex(260, 60),
            radius: 10,
            fill: "#000",
        }))
        ctrl.append(controls.label({
            position: Ex(-140, 42, 1, 0),
            scale: 28,
            text: getValue(),
        }), "value")

        ctrl.append(controls.button({
            position: Ex(-70, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(1, update);
                update(); save();
            }
        }), "plus")
        ctrl.$plus.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "plus",
        }), "icon")

        ctrl.append(controls.button({
            position: Ex(-270, 10, 1, 0),
            size: Ex(60, 60),
            fill: "#3f3f3f",
            radius: 10,
            onClick() {
                onChange(-1, update);
                update(); save();
            }
        }), "minus")
        ctrl.$minus.append(controls.icon({
            position: Ex(0, 0, .5, .5),
            scale: 40,
            icon: "minus",
        }), "icon")

        function update() {
            ctrl.$value.text = getValue();
        }

        this.__scroller.$content.size.y += 90;
        return ctrl;
    },
}