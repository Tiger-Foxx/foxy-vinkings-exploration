import * as PIXI from "pixi.js";
import Color from "../utility/Color";
import System from "../core/System";

export default class PotionType {
    public static readonly HEAL = new PotionType(
        "heal",
        500,
        Color.fromHex("#e226c4"),
        "heal.png",
        1200,
    );
    public static readonly HUNGER = new PotionType(
        "hunger",
        1000,
        Color.fromHex("#6c321d"),
        "hunger.png",
        100,
    );
    public static readonly POWER = new PotionType(
        "power",
        1000,
        Color.fromHex("#e20002"),
        "strength.png",
        1500,
    );
    public static readonly SLOW = new PotionType(
        "slow",
        1000,
        Color.fromHex("#27a63e"),
        "slow.png",
        500,
    );
    public static readonly SPEED = new PotionType(
        "speed",
        1000,
        Color.fromHex("#54ceff"),
        "speed.png",
        800,
    );
    public readonly brewDuration: number;
    public readonly color: Color;
    public readonly duration: number;
    public readonly icon: PIXI.Texture;

    public readonly tag: string;

    constructor(tag: string, duration: number, color: Color, icon: string, brewDuration = 400) {
        this.tag = tag;
        this.duration = duration;
        this.color = color;
        this.icon = PIXI.Texture.from(System.getResource("effect", icon));
        this.brewDuration = brewDuration;
    }
}
