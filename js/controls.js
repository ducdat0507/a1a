let controls = {
    base(args) {
        return {
            id: "",
            controls: [],

            __inScene: false,

            append(ct, id = "") {
                this.controls.push(ct);
                if (id) {
                    this["$" + id] = ct;
                    ct.id = id;
                }
                if (this.__inScene) {
                    function callAdd(control) {
                        if (control.__inScene) return;
                        control.__inScene = true;
                        control.onSceneEnter();
                        for (let child of control.controls) callAdd(child);
                    }
                    callAdd(ct);
                }
            },
            prepend(ct, id = "") {
                this.controls.unshift(ct);
                if (id) {
                    this["$" + id] = ct;
                    ct.id = id;
                }
                if (this.__inScene) {
                    function callAdd(control) {
                        if (control.__inScene) return;
                        control.__inScene = true;
                        control.onSceneEnter();
                        for (let child of control.controls) callAdd(child);
                    }
                    callAdd(ct);
                }
            },
            remove(ct) {
                let index = this.controls.indexOf(ct);
                function callRemove(control) {
                    if (!control.__inScene) return;
                    control.__inScene = false;
                    control.onSceneLeave();
                    for (let child of control.controls) callRemove(child);
                }
                if (index >= 0) {
                    callRemove(this.controls[index]);
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

            onUpdate() {},
            onPointerDown() {},
            onPointerUp() {},
            onPointerEnter() {},
            onPointerLeave() {},
            onPointerMove() {},
            onMouseWheel() {},
            onClick() {},
            onSceneEnter() {},
            onSceneLeave() {},
            ...args
        }
    },
    scene(args) {
        return {
            ...controls.base(),
            __inScene: true,
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

            __mouseIn: false,
            __mouseActive: false,

            onPointerEnter() {
                this.__mouseIn = true;
                pushCursor("pointer");
            },

            onPointerLeave() {
                this.__mouseIn = false;
                popCursor();
            },

            onSceneLeave() {
                if (this.__mouseIn) {
                    popCursor();
                }
            },

            onPointerDown() {
                this.__mouseActive = true;
                let handler = (e) => {
                    this.__mouseActive = false;
                    if (this.__mouseIn) this.onClick();
                    document.removeEventListener("pointerup", handler);
                }
                document.addEventListener("pointerup", handler);
            },

            onClick() {},
            
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
            stroke: "#0000",
            thickness: 4,
            text: "",
            scale: 16,
            style: "normal",
            font: fontFamily,
            align: "center",
            baseline: "middle",
            wrap: false,
            lines: [],
            oldArgs: {},

            render() {
                ctx.fillStyle = this.fill;
                ctx.strokeStyle = this.stroke;
                ctx.lineWidth = this.thickness * scale;
                ctx.textAlign = this.align;
                ctx.textBaseline = this.baseline;
                ctx.font = this.style + " " + (this.scale * scale) + "px " + this.font;

                let lines;
                let pos = this.rect.y;

                if (this.oldArgs.width == this.rect.width && this.oldArgs.height == this.rect.height && this.oldArgs.font == ctx.font && this.oldArgs.text == this.text) {
                    lines = this.lines;
                } else if (!this.wrap) {
                    lines = this.text.split("\n");
                } else {
                    let newLines = [];
                    for (let line of this.text.split("\n")) {
                        let words = line.split(" ");
                        let newLine = "";
                        for (let word of words) {
                            if (ctx.measureText(newLine + word).width > this.rect.width) {
                                newLines.push(newLine);
                                newLine = word + " ";
                            } else {
                                newLine += word + " ";
                            }
                        }
                        newLines.push(newLine);
                    }
                    lines = newLines;
                }

                this.oldArgs = {
                    width: this.rect.width,
                    height: this.rect.height,
                    font: ctx.font,
                    text: this.text
                }

                for (let line of lines) {
                    ctx.strokeText(line, this.rect.x, pos);
                    ctx.fillText(line, this.rect.x, pos);
                    pos += this.scale * scale * 1.3;
                }

                this.lines = lines;
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

            onUpdate() {
                let max = Math.max((this.$content.rect.height - this.rect.height) / scale, 0);

                if (!this.__mouseActive) {
                    this.scrollPos += this.scrollSpd * delta / 1000;
                    this.scrollSpd *= 0.1 ** (delta / 1000);
                    if (this.scrollPos > 0) {
                        this.scrollSpd *= 0.99 ** delta;
                        this.scrollPos *= 0.99 ** delta;
                    } else if (this.scrollPos < -max) {
                        let p = this.scrollPos + max;
                        this.scrollSpd *= 0.99 ** delta;
                        this.scrollPos = -max + p * 0.99 ** delta;
                    }
                }

                this.$content.position.y = this.scrollPos;

                if (this.$content.position.y > 0) {
                    this.$content.position.y -= this.scrollPos * (1 - 1 / (1 + this.scrollPos / 500));
                } else if (this.$content.position.y < -max) {
                    let p = this.scrollPos + max;
                    this.$content.position.y -= p * (1 - 1 / (1 - p / 500));
                }
            },

            render() {
                // let fraction = this.$content.rect.height / this.rect.height;
                // if (fraction <= 1) return;
                // if (!this.__mouseActive) ctx.globalAlpha *= Math.min(Math.abs(this.scrollSpd * 10), 1);
                // if (ctx.globalAlpha > 0) {
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

            onPointerDown(pos, args) {
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

            onMouseWheel(pos, args) {
                this.scrollPos -= Math.sign(args.deltaY) * 50;
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
            fillSub: "#ffffff0c",
            value: 0,
            scale: 16,
            digits: 0,

            currentDigits: [],
            currentAlpha: [],

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

                    if (this.currentDigits.length <= a) {
                        this.currentDigits.push(digit);
                        this.currentAlpha.push(1);
                    }

                    if (this.currentDigits[a] != digit) {
                        this.currentAlpha[a] -= 0.05 * delta;
                        if (this.currentAlpha[a] <= 0) {
                            this.currentAlpha[a] = 0.5;
                            this.currentDigits[a] = digit;
                        }
                    } else {
                        this.currentAlpha[a] += 0.01 * delta;
                        if (this.currentAlpha[a] > 1) this.currentAlpha[a] = 1;
                    }

                    ctx.setTransform(
                        unit, 0, 0, unit,
                        offset + this.rect.x + this.rect.width / 2, 
                        this.rect.y - (this.design.height * unit  + this.rect.height) / 2
                    );

                    for (let s in this.design.segments) {
                        let seg = this.design.segments[s];
                        if (!this.design.digits[this.currentDigits[a]]?.[s] || this.currentAlpha[a] < 1) {
                            ctx.fillStyle = this.fillSub;
                            ctx.fill(seg);
                        }
                        if (this.design.digits[this.currentDigits[a]]?.[s]) {
                            let lastAlpha = ctx.globalAlpha;
                            ctx.fillStyle = this.fillMain;
                            ctx.globalAlpha *= this.currentAlpha[a];
                            ctx.shadowBlur = 0.1 * this.scale * scale * this.currentAlpha[a] ** 0.5;
                            ctx.shadowColor = ctx.fillStyle;
                            ctx.fill(seg);
                            ctx.globalAlpha = lastAlpha;
                            ctx.shadowBlur = 0;
                            ctx.shadowColor = "";
                        }
                    }
                    offset -= (this.design.width + this.design.charSpace) * unit;
                }

                ctx.setTransform(1, 0, 0, 1, 0, 0);
            },
            ...args
        }
    }
}