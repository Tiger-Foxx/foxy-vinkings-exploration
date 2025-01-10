import Random from "./Random";

export default class ChunkRandom extends Random {

    private readonly x: number;
    private readonly y: number;

    constructor(seed: number, x: number, y: number) {
        super(seed);
        this.x = x;
        this.y = y;
    }

    public random(): number {
        const x = Math.sin(this.seed++ + this.x * this.y) * 10000;
        return x - Math.floor(x);
    }
}
