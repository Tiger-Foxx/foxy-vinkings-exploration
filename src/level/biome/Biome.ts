import Localization from "../../core/io/Localization";
import Color from "../../utility/Color";
import KeyedMap from "../../utility/KeyedMap";

export default class Biome {
    private static biomes = new KeyedMap<Biome>();
    public readonly color: Color;
    public readonly name: string;
    public tag = "";

    constructor(name: string, color: Color) {
        this.name = name;
        this.color = color;
    }

    public static add(idx: number, tag: string, biome: Biome): void {
        tag = tag.toLowerCase();
        console.log(`adding ${biome.name} to biome list with tag "${tag}"`);
        this.biomes.add(idx, tag, biome);
        biome.tag = tag;
    }

    public static from(e: number, m: number, t: number): Biome {
        if (e < 6) {
            return Biome.get("deep_ocean");
        }
        if (e < 25) {
            if (t > 230) {
                return Biome.get("warm_ocean");
            }
            if (t < 75) {
                return Biome.get("cold_ocean");
            }
            return Biome.get("ocean");
        }
        if (e < 45 && t > 100) {
            return Biome.get("beach");
        }
        if (t > 200) {
            if (m < 180) {
                return Biome.get("desert");
            }
            if (m > 200) {
                return Biome.get("jungle");
            }
        }
        if (t > 150) {
            if (m < 180) {
                return Biome.get("savanna");
            }
        }

        if (t > 100) {
            if (m > 200) {
                return Biome.get("swamp");
            }
        }

        if (t < 45) {
            return Biome.get("snow");
        }
        if (t < 70) {
            return Biome.get("tundra");
        }
        if (t < 125) {
            if (m > 155) {
                return Biome.get("taiga");
            }
        }
        if (t < 155) {
            if (m > 100 && m < 155) {
                return Biome.get("forest");
            }
        }
        return Biome.get("grassland");
    }

    public static get(tag: string | number): Biome {
        const biome = this.biomes.get(tag);
        if (!biome) {
            return this.biomes.get(0);
        }
        return biome;
    }

    public static getKeys(biome: Biome): { idx: number | undefined, tag: string | undefined } {
        return this.biomes.getKeys(biome);
    }

    public static initBiomeList(): void {
        Biome.add(0, "ocean", new Biome("Ocean", Color.fromHex("#026fff")));
        Biome.add(1, "deep_ocean", new Biome("Deep Ocean", Color.fromHex("#0259bd")));
        Biome.add(2, "warm_ocean", new Biome("Warm Ocean", Color.fromHex("#20abff")));
        Biome.add(3, "cold_ocean", new Biome("Cold Ocean", Color.fromHex("#4cbcff")));
        Biome.add(4, "beach", new Biome("Beach", Color.fromHex("#e0ff18")));
        Biome.add(5, "tundra", new Biome("Tundra", Color.fromHex("#82fff5")));
        Biome.add(6, "snow", new Biome("Snow", Color.fromHex("#f9f9f9")));
        Biome.add(7, "taiga", new Biome("Taiga", Color.fromHex("#4b966f")));
        Biome.add(8, "grassland", new Biome("Grassland", Color.fromHex("#35bf35")));
        Biome.add(9, "forest", new Biome("Forest", Color.fromHex("#3fb132")));
        Biome.add(10, "desert", new Biome("Desert", Color.fromHex("#ffd870")));
        Biome.add(11, "jungle", new Biome("Jungle", Color.fromHex("#1a561a")));
        Biome.add(12, "savanna", new Biome("Savanna", Color.fromHex("#9ce749")));
        Biome.add(13, "river", new Biome("River", Color.fromHex("#4cbcff")));
        Biome.add(14, "cave", new Biome("Cave", Color.fromHex("#626262")));
        Biome.add(15, "swamp", new Biome("Swamp", Color.fromHex("#407905")));
    }

    public getDisplayName(): string {
        return Localization.get(`biome.${this.tag}`);
    }

    public is(tag: string): boolean {
        return this.tag === tag.toLowerCase();
    }
}


