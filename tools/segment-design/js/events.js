let events = {
    events: {},
    on(event, callback, scope) {
        this.events[event] ??= [];
        if (!this.events[event].includes(callback)) this.events[event].push({
            callback, scope
        });
    },
    off(event, callback) {
        this.events[event] ??= [];
        let index;
        if ((index = this.events[event].findIndex(x => x.callback == callback)) >= 0) 
        {
            this.events[event].splice(index, 1);
        }
    },
    emit(event, ...args) {
        this.events[event] ??= [];
        for (let ev of this.events[event]) ev.callback.call(ev.scope, ...args);
    },
    alias(baseEvent, ...otherEvents) {
        this.add(baseEvent, () => otherEvents.forEach(this.emit));
    }
}