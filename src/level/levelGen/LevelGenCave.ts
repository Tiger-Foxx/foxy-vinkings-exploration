import System from "../../core/System";
import ChunkRandom from "../../utility/ChunkRandom";
import SimplexNoise from "../../utility/SimplexNoise";
import Biome from "../biome/Biome";
import Level from "../Level";
import LevelTile from "../LevelTile";
import Tiles from "../tile/Tiles";
import LevelGen from "./LevelGen";

export default class LevelGenCave extends LevelGen {

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
                    {zoom: 4, frequency: 50, octaves: 6, evolution: 2.5, persistence: 0.5, amplitude: 2})))) * 255);

                const biome = Biome.get("cave");

                const tile = new LevelTile({level, x, y, biome, moisture, temperature, elevation});
                map.push(tile);

                tile.setTile(Tiles.ROCK);

                if (river > 230) {
                    tile.setTile(Tiles.DIRT);
                    if (random.probability(20)) {
                        tile.setTile(Tiles.STONE);
                    }
                    if (random.probability(20)) {
                        tile.setTile(Tiles.MUSHROOM);
                    }
                }
                if (elevation < 10 && river > 240) {
                    if (temperature > 128) {
                        tile.setTile(Tiles.LAVA);
                    } else {
                        tile.setTile(Tiles.WATER);
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
