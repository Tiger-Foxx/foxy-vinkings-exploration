type ExtendedProperties<T> = { [P in keyof T]: T[P] };
export type StateType = Record<string, any>;
export default class TileStates<T extends StateType> {

    private readonly defaultStates: T;

    private constructor(defaultStates: T) {
        this.defaultStates = defaultStates;
        this.resetDefault();
    }

    public static create<T>(def: T = {} as T): TileStates<T> & ExtendedProperties<T> {
        return new TileStates(def) as TileStates<T> & ExtendedProperties<T>;
    }

    public getStates(): T {
        const keys = Object.keys(this.defaultStates);
        const data = {};
        keys.forEach((key: any) => {
            data[key] = this[key];
        });
        return data as T;
    }

    public resetDefault(): TileStates<T> {
        Object.keys(this.defaultStates).forEach((key: any) => {
            this[key] = this.defaultStates[key];
        });
        return this;
    }

    public set(data: T = {} as T): TileStates<T> {
        Object.keys(data).forEach((key: any) => {
            if (!this[key]) return;
            this[key] = data[key];
        });
        return this;
    }

    public toBSON(): any {
        const keys = Object.keys(this.defaultStates);
        if (keys.length === 0) {
            return null;
        }
        const data = {};
        keys.forEach((key: any) => {
            if (this[key] !== this.defaultStates[key]) {
                data[key] = this[key];
            }
        });
        if (Object.keys(data).length === 0) {
            return null;
        }
        return data;
    }
}
