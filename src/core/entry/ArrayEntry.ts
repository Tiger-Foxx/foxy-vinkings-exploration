import Entry from "./Entry";

export default class ArrayEntry extends Entry {

    private readonly options: any[];
    private selection = 0;

    constructor(label: string, ...options: any[]) {
        super(label);
        if (options.length === 1 && options[0] instanceof Array) {
            options = options[0];
        }
        this.options = options;
    }

    public getSelection(): number {
        return this.selection;
    }

    public getValue(): any {
        return this.options[this.selection];
    }

    public setSelection(idx: number): void {
        if (idx >= 0 && idx < this.options.length) {
            this.selection = idx;
        }
    }

    public setValue(value: unknown): void {
        this.setSelection(this.getIndex(value));
    }

    private getIndex(value: any): number {
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i] === value) {
                return i;
            }
        }
        return -1;
    }

}
