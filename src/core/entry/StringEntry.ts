import Entry from "./Entry";

export default class StringEntry extends Entry {

    private text: string;

    constructor(label: string, text: string) {
        super(label);
        this.text = text;
    }

    public getValue(): string {
        return this.text;
    }

    public setValue(value: string): void {
        this.text = value;
    }
}
