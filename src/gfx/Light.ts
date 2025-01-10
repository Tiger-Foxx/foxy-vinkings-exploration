import * as PIXI from "pixi.js";

export default class Light extends PIXI.Sprite {

    private brightness = 1;
    private tintColor = 0xffffff;

    constructor() {
        super(PIXI.Texture.WHITE);
        this.width = 16;
        this.height = 16;
        this.tint = 0xffffff;
        this.alpha = 1;
        this.visible = false;
    }

    public getColor(): number {
        return this.tintColor;
    }

    public setBrightness(value: number): this {
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        if (this.brightness === value) return this;
        this.brightness = value;
        this.updateTint();
        return this;
    }

    public setColor(color: number): this {
        if (this.tintColor === color) return this;
        this.tintColor = color;
        this.updateTint();
        return this;
    }

    private updateTint(): void {
        const color = this.tintColor;
        const r = ((color >> 16) & 0b11111111) * this.brightness;
        const g = ((color >> 8) & 0b11111111) * this.brightness;
        const b = (color & 0b11111111) * this.brightness;
        this.tint = (((~~r) << 8) + (~~g) << 8) + (~~b);
        this.visible = this.tint !== 0x000000;
    }
}
