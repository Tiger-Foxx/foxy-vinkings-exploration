import * as PIXI from "pixi.js";
import System from "../../core/System";
import Entity from "../../entity/Entity";
import LevelTile from "../../level/LevelTile";

export default class Resource {
    public texture: PIXI.BaseTexture;

    constructor(path: string) {
        this.texture = PIXI.BaseTexture.from(System.getResource("items", path));
        this.texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        return false;
    }
}
