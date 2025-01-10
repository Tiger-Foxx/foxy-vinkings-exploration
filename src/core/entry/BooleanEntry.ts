import ArrayEntry from "./ArrayEntry";

export default class BooleanEntry extends ArrayEntry {
    constructor(label: string, initial: boolean) {
        super(label, [true, false]);
        this.setSelection(initial ? 0 : 1);
    }

    public toString(): string {
        return `${this.getLabel()}: ${this.getValue() ? "On" : "Off"}`;
    }
}
