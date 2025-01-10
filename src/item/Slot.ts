import Item from "./Item";

export default class Slot {
    public item?: Item;

    public nb = 0;

    constructor(item?: Item, nb = 0) {
        this.nb = nb;
        this.item = item;
    }

    public clear(): void {
        this.item = undefined;
        this.nb = 0;
    }

    public clone(): Slot {
        return new Slot(this.item, this.nb);
    }

    public isEmpty(): boolean {
        return this.item === null || this.nb === null || this.nb <= 0;
    }

    public isItem(): boolean {
        return this.item instanceof Item;
    }

    // @BUG
    public removeItem(nb: number): number {
        this.nb -= nb;
        const n = this.nb;
        if (this.nb <= 0) {
            this.clear();
        }
        return n;
    }
}
