export default abstract class Entry {

    private readonly label: string;

    protected constructor(label: string) {
        this.label = label;
    }

    public getLabel(): string {
        return this.label;
    }

    public abstract getValue(): any;

    public abstract setValue(value: unknown): void;

    public toString(): string {
        return `${this.getLabel()}: ${this.getValue()}`;
    }
}
