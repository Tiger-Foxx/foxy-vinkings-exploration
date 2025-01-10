import * as PIXI from "pixi.js";
import System from "../core/System";

export default class ToolType {
    private static readonly levelName = ["wood", "stone", "iron", "gold", "diamond"];
    public static readonly AXE = new ToolType("axe");
    public static readonly HOE = new ToolType("hoe");
    public static readonly PICKAXE = new ToolType("pickaxe");
    public static readonly SHOVEL = new ToolType("shovel");
    public static readonly SWORD = new ToolType("sword");
    public readonly name: string;
    public readonly textures: PIXI.Texture[] = [];

    private constructor(name: string) {
        this.name = name;
        ToolType.levelName.forEach((level) => {
            const texture = PIXI.Texture.from(System.getResource("items", `${level}_${name}.png`));
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.textures.push(texture);
        });
    }

    public static get nbLevel(): number {
        return this.levelName.length;
    }

    public static getLevelName(id: number): string {
        return this.levelName[id];
    }
}
