let controls = {
    base(args) {
        return {
            id: "",
            controls: [],
            append(ct, id = "") {
                this.controls.push(ct);
                if (id) {
                    this["_" + id] = ct;
                    ct.id = id;
                }
            },
            remove(ct) {
                let index = this.controls.indexOf(ct);
                if (index > 0) {
                    this.controls.splice(index, 1);
                    if (ct.id && this.controls["_" + id]) delete this.controls["_" + id];
                }
            },

            position: { fx: 0, fy: 0, sx: 0, sy: 0 },
            size: { fx: 0, fy: 0, sx: 0, sy: 0 },
            rect: { x: 0, y: 0, width: 0, height: 0 },

            render() {},

            onupdate() {},
            onpointerdown() {},
            onclick() {},
            ...args
        }
    },
    rect(args) {
        return {
            ...controls.base(),
            fill: "white",
            radius: 0,

            render() {
                ctx.fillStyle = this.fill;
                if (this.radius) {
                    let radius = this.radius * scale;
                    ctx.beginPath();
                    ctx.moveTo(this.rect.x + radius, this.rect.y);
                    ctx.arc(
                        this.rect.x + this.rect.width - radius, 
                        this.rect.y + radius,
                        radius, Math.PI * -.5, 0
                    );
                    ctx.arc(
                        this.rect.x + this.rect.width - radius, 
                        this.rect.y + this.rect.height - radius,
                        radius, 0, Math.PI * .5
                    );
                    ctx.arc(
                        this.rect.x + radius,
                        this.rect.y + this.rect.height - radius, 
                        radius, Math.PI * .5, Math.PI
                    );
                    ctx.arc(
                        this.rect.x + radius, 
                        this.rect.y + radius,
                        radius, Math.PI, Math.PI * 1.5
                    );
                    ctx.fill();
                } else {
                    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
            },
            ...args
        }
    },
    text(args) {
        return {
            ...controls.base(),
            fill: "white",
            text: "",
            size: 16,
            font: "Arial",

            render() {
                ctx.fillStyle = this.fill;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = (this.size * scale) + "px " + this.font;
                ctx.fillText(this.text, this.rect.x, this.rect.y);
            },
            ...args
        }
    },
}