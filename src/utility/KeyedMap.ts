interface KeyData<T> {
    data: T;
    idx: number;
    tag: string;
}

export default class KeyedMap<T> {
    private data: Array<KeyData<T>> = [];

    public add(idx: number, tag: string, data: T): boolean {
        if (this.getByIdx(idx) || this.getByTag(tag)) {
            return false;
        }
        this.data.push({idx, tag, data});
        return true;
    }

    public get(index: string | number): T | undefined {
        return isNaN(index as number) ? this.getByTag(index as string) : this.getByIdx(index as number);
    }

    public getByIdx(idx: number): T | undefined {
        return this.data.find((kd) => kd.idx === idx)?.data;
    }

    public getByTag(tag: string): T | undefined {
        return this.data.find((kd) => kd.tag === tag)?.data;
    }

    public getKeys(data: T): { idx: number | undefined, tag: string | undefined } {
        const keyData = this.data.find((kd) => kd.data === data);
        return {
            idx: keyData?.idx,
            tag: keyData?.tag,
        };
    }

    public getSome(...tags: string[]): T[] {
        return this.data.flatMap((kd) => tags.includes(kd.tag) ? [kd.data] : []);
    }
}
