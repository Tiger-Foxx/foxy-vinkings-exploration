export default class Seed {
    public static create(str: string | number = Math.random()): number {
        if (Number.isInteger(Number(str))) {
            return Number(str);
        }
        str = str.toString();
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        }
        return h;
    }
}
