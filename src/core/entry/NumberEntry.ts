import Entry from "./Entry";

export default class NumberEntry extends Entry {

    private number: number;

    constructor(label: string, number: number) {
        super(label);
        this.number = number;
    }

    public getValue(): number {
        return this.number;
    }

    public setValue(value: number): void {
        this.number = value;
    }
}
