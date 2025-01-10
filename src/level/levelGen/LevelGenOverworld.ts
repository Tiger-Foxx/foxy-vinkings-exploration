import System from "../../core/System";
import ChunkRandom from "../../utility/ChunkRandom";
import SimplexNoise from "../../utility/SimplexNoise";
import Biome from "../biome/Biome";
import Level from "../Level";
import LevelTile from "../LevelTile";
import Tiles from "../tile/Tiles";
import LevelGen from "./LevelGen";

export default class LevelGenOverworld extends LevelGen {

    private elevationNoise: SimplexNoise;
    private moistureNoise: SimplexNoise;
    private temperatureNoise: SimplexNoise;

    constructor(seed: number | string = 0) {
        super(seed);
        this.elevationNoise = new SimplexNoise(this.seed);
        this.moistureNoise = new SimplexNoise((this.seed + 1) * 16);
        this.temperatureNoise = new SimplexNoise((this.seed + 2) * 32);
    }

    public genChunk(cX: number, cY: number, level?: Level, callback?: () => void): LevelTile[] {
        const random = new ChunkRandom(this.seed, cX, cY);
        const t1 = System.nanoTime();
        const map = [];
        const x1 = cX * LevelGen.chunkSize;
        const y1 = cY * LevelGen.chunkSize;
        const x2 = x1 + LevelGen.chunkSize;
        const y2 = y1 + LevelGen.chunkSize;
        const zoom = 2;
        for (let y = y1; y < y2; y++) {
            for (let x = x1; x < x2; x++) {

                const elevation = ~~(this.elevationNoise.get(x, y,
                    {frequency: 32, zoom, octaves: 2, amplitude: 3, persistence: 0.5, evolution: 4}) * 255);

                const moisture = ~~(this.moistureNoise.get(x, y,
                    {zoom, frequency: 50, octaves: 3, amplitude: 2, persistence: 0.5, evolution: 2}) * 255);

                const temperature = ~~(this.temperatureNoise.get(x, y,
                    {zoom, frequency: 75, octaves: 3, amplitude: 2, persistence: 0.5, evolution: 2}) * 255);

                const river = ~~((2 * (0.5 - Math.abs(0.5 - this.elevationNoise.get(x, y,
                    {zoom: 2, frequency: 150, octaves: 4, evolution: 2.5, persistence: 1, amplitude: 1})))) * 255);

                let biome = Biome.from(elevation, moisture, temperature);
                if (!biome.tag.includes("ocean") && river > 240) {
                    biome = Biome.get("river");
                }

                const tile = new LevelTile({level, x, y, biome, moisture, temperature, elevation});
                map.push(tile);

                tile.setTile(Tiles.GRASS);

                if (biome.tag.includes("ocean")) {
                    tile.setTile(Tiles.WATER);
                    if (random.probability(60)) {
                        tile.setTile(Tiles.LILYPAD);
                    }
                    if (random.probability(30) && elevation > 20) {
                        tile.setTile(Tiles.SUGAR_CANE);
                    }
                    if (temperature < 40 && random.probability(temperature / 25)) {
                        tile.setTile(Tiles.ICE);
                    }
                }
                if (biome.is("beach")) {
                    tile.setTile(Tiles.SAND);
                    if (random.probability(25)) {
                        tile.setTile(Tiles.PALM);
                    }
                }
                if (biome.is("desert")) {
                    tile.setTile(Tiles.SAND);
                    if (random.probability(50)) {
                        tile.setTile(Tiles.CACTUS);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }
                if (biome.is("savanna")) {
                    tile.setTile(Tiles.DIRT);
                    if (random.probability(15)) {
                        tile.setTile(Tiles.ACACIA);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }
                if (biome.is("forest")) {
                    tile.setTile(Tiles.GRASS);
                    if (random.probability(4)) {
                        tile.setTile(Tiles.TREE);
                    }
                    if (random.probability(4)) {
                        tile.setTile(Tiles.BIRCH);
                    }
                    if (random.probability(4)) {
                        tile.setTile(Tiles.SPRUCE);
                    }
                    if (random.probability(20)) {
                        tile.setTile(Tiles.FLOWER);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }
                if (biome.is("grassland")) {
                    if (random.probability(10)) {
                        tile.setTile(Tiles.TREE);
                    } else if (random.probability(20)) {
                        tile.setTile(Tiles.BIRCH);
                    }
                    if (random.probability(20)) {
                        tile.setTile(Tiles.BUSH);
                    }

                    if (random.probability(20)) {
                        tile.setTile(Tiles.FLOWER);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }

                if (biome.is("tundra") || biome.is("snow")) {
                    tile.setTile(Tiles.SNOW);
                    if (random.probability(10)) {
                        tile.setTile(Tiles.SPRUCE);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }

                if (biome.is("taiga")) {
                    tile.setTile(Tiles.DARK_GRASS);
                    if (random.probability(10)) {
                        tile.setTile(Tiles.SPRUCE);
                    }
                    if (random.probability(50)) {
                        tile.setTile(Tiles.STONE);
                    }
                }

                if (biome.is("swamp")) {
                    tile.setTile(Tiles.DIRT);
                    if (random.probability(5)) {
                        tile.setTile(Tiles.DARK_GRASS);
                    }
                    if (random.probability(15)) {
                        tile.setTile(Tiles.SWAMP_TREE);
                    }
                    if (random.probability(30)) {
                        tile.setTile(Tiles.STONE);
                    }
                    if (random.probability(25)) {
                        tile.setTile(Tiles.WATER);
                    }
                }

                if (elevation > 210) {
                    tile.setTile(Tiles.ROCK);
                }
                if (biome.is("river")) {
                    tile.setTile(Tiles.DIRT);
                    if (river > 245) {
                        tile.setTile(Tiles.LAVA);
                    }
                }
            }
        }
        console.log(`chunk ${cX} ${cY} generated in ${(System.nanoTime() - t1) / 1000000}ms`);
        if (callback instanceof Function) {
            callback();
        }
        return map;
    }
}
