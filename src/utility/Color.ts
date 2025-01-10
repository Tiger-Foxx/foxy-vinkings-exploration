export default class Color {
    public a = 1;
    public b = 0;
    public g = 0;

    public r = 0;

    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static get black(): Color {
        return new Color(0, 0, 0);
    }

    static get blue(): Color {
        return new Color(0, 0, 255);
    }

    static get green(): Color {
        return new Color(0, 255, 0);
    }

    static get red(): Color {
        return new Color(255, 0, 0);
    }

    static get white(): Color {
        return new Color(255, 255, 255);
    }

    static get yellow(): Color {
        return new Color(255, 255, 0);
    }

    public static fromHex(hex: string): Color {
        const rgb = parseInt(hex.replace(/[^0-9A-F]/gi, ""), 16);
        return Color.fromNumber(rgb);
    }

    public static fromNumber(rgb: number): Color {
        return new Color(
            ((rgb >> 16) & 0b11111111),
            ((rgb >> 8) & 0b11111111),
            (rgb & 0b11111111),
        );
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public getInt(): number {
        return ((this.r << 8) + this.g << 8) + this.b;
    }

    public mix(c: Color): Color {
        this.r = this.r * 0.5 + c.r * 0.5;
        this.g = this.g * 0.5 + c.g * 0.5;
        this.b = this.b * 0.5 + c.b * 0.5;
        return this;
    }

    public toString(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
}
