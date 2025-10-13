panes.export = class extends Pane {

    /** @type {HTMLElement} */
    output;

    constructor(elm) {
        super(elm);
        this.output = $make.pre({className: "export-pane__output"});
        elm.append(this.output);

        events.on("selection-update", this.onUpdate, this);
        events.on("property-update", this.onUpdate, this);

        this.onUpdate();
    }

    onUpdate(source, freq = 0) {

        let elm = this.output;

        let output = "{\n    segments: [\n";
        let totalPathBuilder = new PathKit.SkOpBuilder();
        for (let elm of currentDesign.design) {
            let path = elm.toPath();
            totalPathBuilder.add(path, elm.operation == DesignElementOperation.SUBTRACT ? PathKit.PathOp.DIFFERENCE : PathKit.PathOp.UNION)
            path.delete();
        }

        let totalPath = totalPathBuilder.make();
        let totalPaths = [...totalPath.toSVGString().matchAll(/M[^Z]*Z?/gi)].map(x => x[0])
        let totalPaths2D = totalPaths.map(x => new Path2D(x));
        for (let path of totalPaths) {
            output += `        "${path}",\n`;
        }

        output += `    ],\n    digits: [\n`;
        let wiring = new Array(totalPaths2D.length).fill("").map(x => []);
        for (let wire of currentDesign.wires) {
            for (let index in totalPaths2D) {
                let path = totalPaths2D[index];
                if (elements.canvasCtx.isPointInPath(path, wire.position.x, wire.position.y, "nonzero")) 
                {
                    wiring[index].push(wire);
                    break;
                }
            }
        }
        for (let digit = 0; digit <= 9; digit++) {
            output += `        [${wiring.map(x => +x[0]?.digits[digit] || 0).join(", ")}],\n`;
        }

        output += `    ],\n}`;
        totalPathBuilder.delete();
        totalPath.delete();

        this.output.innerHTML = output;

    }

    cleanup(elm) {
        events.off("selection-update", this.onUpdate);
        events.off("property-update", this.onUpdate);
    }
}
