const form = {
    prop(name, ...child) {
        const id = Math.random().toString().substring(2);
        return $make.div({className: "form-prop"}, 
            $make.label({ id }, name),
            $make.div({ "aria-labelled-by": id }, ...child),
        )
    },
    select(items, get, set) {
        let buttons = Object.entries(items).map(([x, i]) => (
            $make.button({ "on:click": () => doSet(x), _key: x}, i)
        ));
        function update() {
            const currentValue = get();
            console.log(currentValue);
            for (let button of buttons) button.ariaSelected = button._key == currentValue;
        }
        update();
        function doSet(value) {
            set(value);
            update();
        }
        return $make.div({className: "form-select"}, 
            ...buttons
        )
    },
    number(unit, req, get, set) {
        let input = $make.input({ 
            type: "number", 
            "on:change": () => doSet(input.value),
            ...req,
        })
        function update() {
            const currentValue = get();
            input.value = currentValue;
        }   
        update();
        function doSet(value) {
            set(+value);
            update();
        }
        return $make.div({className: "form-number"}, 
            input,
            $make.span({}, unit)
        )
    },
    toggle(child, get, set) {
        let value = get();
        let button = $make.button({ 
            type: "number", 
            "on:click": () => doToggle(),
        }, child)
        function update() {
            const currentValue = get();
            button.ariaChecked = value = currentValue;
        }   
        update();
        function doToggle() {
            set(value = !value);
            update();
        }
        return $make.div({className: "form-toggle"}, 
            button
        )
    },
    toggleField(toggles) {
        return $make.div({className: "form-toggle-field"}, 
            ...toggles
        )
    },
}