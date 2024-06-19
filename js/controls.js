let controls = {
    base(args) {
        return {
            id: "",
            controls: [],
            append(ct, id = "") {
                this.controls.push(ct);
                if (id) {
                    this["$" + id] = ct;
                    ct.id = id;
                }
            },
            remove(ct) {
                let index = this.controls.indexOf(ct);
                if (index >= 0) {
                    this.controls.splice(index, 1);
                    if (ct.id && this.controls["$" + ct.id]) delete this.controls["$" + ct.id];
                }
            },

            position: Ex(0, 0, 0, 0),
            size: Ex(0, 0, 0, 0),
            rect: Rect(0, 0, 0, 0),

            alpha: 1,
            clickthrough: false,

            render() {},

            onupdate() {},
            onpointerdown() {},
            onpointerup() {},
            onpointerin() {},
            onpointerout() {},
            onpointermove() {},
            onmousewheel() {},
            onclick() {},
            ...args
        }
    },
    rect(args) {
        return {
            ...controls.base(),
            fill: "white",
            radius: 0,

            getBoundingPath() {
                let radius = this.radius * scale;
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
            },

            render() {
                ctx.fillStyle = this.fill;
                if (this.radius) {
                    ctx.beginPath();
                    this.getBoundingPath();
                    ctx.fill();
                } else {
                    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
            },
            ...args
        }
    },
    button(args) {
        return {
            ...controls.rect(),

            fillHover: "#fff7",
            fillActive: "#0003",

            __mouseActive: false,

            onpointerin() {
                pushCursor("pointer");
            },

            onpointerout() {
                popCursor();
            },

            onpointerdown() {
                this.__mouseActive = true;
                let handler = (e) => {
                    this.__mouseActive = false;
                    if (this.__mouseIn) this.onclick();
                    document.removeEventListener("pointerup", handler);
                }
                document.addEventListener("pointerup", handler);
            },

            onclick() {},
            
            render() {
                ctx.fillStyle = this.fill;
                
                let level = this.__mouseActive * this.__mouseIn;
                if (!isTouch) level += this.__mouseIn 

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
                    if (level >= 1) {
                        ctx.fillStyle = this.fillHover;
                        ctx.fill();
                        if (level >= 2) {
                            ctx.fillStyle = this.fillActive;
                            ctx.fill();
                        }
                    }
                } else {
                    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                    if (level >= 1) {
                        ctx.fillStyle = this.fillHover;
                        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                        if (level >= 2) {
                            ctx.fillStyle = this.fillActive;
                            ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                        }
                    }
                }
            },

            ...args
        }
    },
    label(args) {
        return {
            ...controls.base(),
            fill: "white",
            text: "",
            scale: 16,
            style: "normal",
            font: "SF Pro, Inter, Arial",
            align: "center",
            wrap: false,

            render() {
                ctx.fillStyle = this.fill;
                ctx.textAlign = this.align;
                ctx.textBaseline = "top";
                ctx.font = this.style + " " + (this.scale * scale) + "px " + this.font;
                if (this.wrap) {
                    let words = this.text.split(" ");
                    let line = "";
                    let pos = this.rect.y;
                    for (let word of words) {
                        if (ctx.measureText(line + word).width > this.rect.width) {
                            ctx.fillText(line, this.rect.x, pos);
                            pos += this.scale * scale * 1.2;
                            line = word + " ";
                        } else {
                            line += word + " ";
                        }
                    }
                    ctx.fillText(line, this.rect.x, pos);
                } else {
                    ctx.fillText(this.text, this.rect.x, this.rect.y, this.rect.width || undefined);
                }
            },
            ...args
        }
    },
    icon(args) {
        return {
            ...controls.label(),
            set: "tabler",
            fill: "white",
            scale: 16,

            render() {
                let iconset = iconsets[this.set];

                ctx.fillStyle = this.fill;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = (this.scale * scale) + "px " + iconset.font;
                ctx.fillText(iconset.charmap[this.icon], this.rect.x, this.rect.y, this.rect.width || undefined);
            },

            ...args
        }
    },
    scroller(args) {
        let ct = {
            ...controls.rect(),

            __mouseActive: false,
            scrollPos: 0,
            scrollSpd: 0,
            mask: true,

            onupdate() {
                let max = Math.max((this.$content.rect.height - this.rect.height) / scale, 0);

                if (!this.__mouseActive) {
                    this.scrollPos += this.scrollSpd * delta / 1000;
                    this.scrollSpd *= 0.1 ** (delta / 1000);
                    if (this.scrollPos > 0) {
                        this.scrollSpd *= 1e-3 ** (delta / 1000);
                        this.scrollPos *= 1e-3 ** (delta / 1000);
                    } else if (this.scrollPos < -max) {
                        let p = this.scrollPos + max;
                        this.scrollSpd *= 1e-3 ** (delta / 1000);
                        this.scrollPos = -max + p * 1e-3 ** (delta / 1000);
                    }
                }

                this.$content.position.y = this.scrollPos;

                if (this.$content.position.y > 0) {
                    this.$content.position.y -= this.scrollPos * (1 - 1 / (1 + this.scrollPos / 150));
                } else if (this.$content.position.y < -max) {
                    let p = this.scrollPos + max;
                    this.$content.position.y -= p * (1 - 1 / (1 - p / 150));
                }
            },

            onpointerdown(pos, args) {
                this.__mouseActive = true;
                let startPos = mousePos;
                let startScr = this.scrollPos;
                let scrTime = time;
                let isScrolling = false;
                let movehandler = (e) => {
                    let pos = {
                        x: e.clientX * resScale,
                        y: e.clientY * resScale,
                    }
                    if (!isScrolling && Math.abs(startPos.y - pos.y) < 10 * scale) return;
                    isScrolling = true;
                    let d = startScr + (pos.y - startPos.y) / scale;
                    this.scrollSpd = (d - this.scrollPos) / delta * 1000;
                    this.scrollPos = d;
                    this.$content.clickthrough = true;
                    scrTime = time;
                }
                let uphandler = (e) => {
                    this.__mouseActive = false;
                    if (Math.abs(this.scrollSpd) < 20 || time - scrTime > 100) this.scrollSpd = 0;
                    this.$content.clickthrough = false;

                    document.removeEventListener("pointermove", movehandler);
                    document.removeEventListener("pointerup", uphandler);
                }
                document.addEventListener("pointermove", movehandler);
                document.addEventListener("pointerup", uphandler);
            },

            onmousewheel(pos, args) {
                this.scrollPos -= Math.sign(args.deltaY) * 50;
            },

            render() {
                // ctx.fillStyle = this.fill;
                // ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                // let fraction = this.$content.rect.height / this.rect.height;
                // if (fraction > 1) {
                //     ctx.fillStyle = "#aaa";
                //     let offset = (this.rect.y - this.$content.rect.y);
                //     ctx.fillRect(
                //         this.rect.x + this.rect.width - 5 * scale, 
                //         this.rect.y + this.rect.height * offset / this.rect.height / fraction, 
                //         5 * scale, 
                //         this.rect.height / fraction
                //     );
                // } 
            },

            ...args
        }
        ct.append(controls.base({
            size: Ex(0, 0, 1),
        }), "content")
        return ct;
    },
    counter(args) {
        return {
            ...controls.base(),
            fillMain: "white",
            fillSub: "#ffffff18",
            value: 0,
            design: {
                width: 12,
                height: 30,
                charSpace: 2,
                sepSpace: 5,
                segments: [
                    [
                        ["moveTo", "1.5x", "0y"],
                        ["lineTo", "9.5x", "0y"],
                        ["lineTo", "9.5x", "2y"],
                        ["lineTo", "0x", "2y"],
                        ["lineTo", "0x", "1.5y"],
                    ],
                    [
                        ["moveTo", "10.5x", "0y"],
                        ["lineTo", "12x", "1.5y"],
                        ["lineTo", "12x", "14.6y"],
                        ["lineTo", "11x", "14.6y"],
                        ["lineTo", "10x", "13.6y"],
                        ["lineTo", "10x", "0y"],
                    ],
                    [
                        ["moveTo", "11x", "15.4y"],
                        ["lineTo", "12x", "15.4y"],
                        ["lineTo", "12x", "28.5y"],
                        ["lineTo", "10.5x", "30y"],
                        ["lineTo", "10x", "30y"],
                        ["lineTo", "10x", "16.4y"],
                    ],
                    [
                        ["moveTo", "0x", "28y"],
                        ["lineTo", "9.5x", "28y"],
                        ["lineTo", "9.5x", "30y"],
                        ["lineTo", "1.5x", "30y"],
                        ["lineTo", "0x", "28.5y"],
                    ],
                    [
                        ["moveTo", "1x", "15.4y"],
                        ["lineTo", "2x", "16.4y"],
                        ["lineTo", "2x", "27.5y"],
                        ["lineTo", "0x", "27.5y"],
                        ["lineTo", "0x", "15.4y"],
                    ],
                    [
                        ["moveTo", "0x", "2.5y"],
                        ["lineTo", "2x", "2.5y"],
                        ["lineTo", "2x", "13.6y"],
                        ["lineTo", "1x", "14.6y"],
                        ["lineTo", "0x", "14.6y"],
                    ],
                    [
                        ["moveTo", "2.7x", "14y"],
                        ["lineTo", "9.3x", "14y"],
                        ["lineTo", "10.3x", "15y"],
                        ["lineTo", "9.3x", "16y"],
                        ["lineTo", "2.7x", "16y"],
                        ["lineTo", "1.7x", "15y"],
                    ],
                ],
                digits: {
                    0: [1, 1, 1, 1, 1, 1, 0],
                    1: [0, 1, 1, 0, 0, 0, 0],
                    2: [1, 1, 0, 1, 1, 0, 1],
                    3: [1, 1, 1, 1, 0, 0, 1],
                    4: [0, 1, 1, 0, 0, 1, 1],
                    5: [1, 0, 1, 1, 0, 1, 1],
                    6: [1, 0, 1, 1, 1, 1, 1],
                    7: [1, 1, 1, 0, 0, 0, 0],
                    8: [1, 1, 1, 1, 1, 1, 1],
                    9: [1, 1, 1, 1, 0, 1, 1],
                },
            },
            scale: 16,
            digits: 0,

            render() {
                let str = this.value.toFixed(0).padStart(this.digits);
                let unit = this.scale * scale / this.design.height;
                let width = (
                    str.length * this.design.width
                    + (str.length - 1) * this.design.charSpace
                    + Math.floor((str.length - 1) / 3) * this.design.sepSpace
                ) * unit;
                let offset = width / 2 - (this.design.width - this.design.sepSpace) * unit;

                for (let a = 0; a < str.length; a++) {
                    let digit = str[str.length - 1 - a];
                    if (a % 3 == 0) offset -= (this.design.sepSpace) * unit;
                    for (let s in this.design.segments) {
                        let seg = this.design.segments[s];
                        ctx.beginPath();
                        for (let ins of seg) {
                            let cmd = ins[0];
                            let args = [];
                            for (let i = 1; i < ins.length; i++) {
                                let code = ins[i][ins[i].length - 1];
                                if (code == "x") {
                                    args.push(ins[i].slice(0, ins[i].length - 1) * unit + offset + this.rect.x + this.rect.width / 2);
                                } else if (code == "y") {
                                    args.push(((ins[i].slice(0, ins[i].length - 1)) - this.design.height / 2) * unit + this.rect.y + this.rect.height / 2);
                                } else if (code == " ") {
                                    args.push(ins[i].slice(0, ins[i].length - 1));
                                } else {
                                    args.push(ins[i]);
                                }
                            }
                            ctx[cmd](...args);
                        }
                        ctx.fillStyle = this.design.digits[digit]?.[s] ? this.fillMain : this.fillSub;
                        ctx.shadowBlur = this.design.digits[digit]?.[s] ? 50 : 0;
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "";
                    }
                    offset -= (this.design.width + this.design.charSpace) * unit;
                }
            },
            ...args
        }
    }
}