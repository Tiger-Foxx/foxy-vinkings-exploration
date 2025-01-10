import System from "../core/System";

export default class Random {
    private static $ = Random.create();
    public seed: number;
    private haveNextGaussian = false;
    private nextGaussian = 0;

    constructor(seed = System.currentTimeMillis()) {
        this.seed = seed;
    }

    public static boolean(): boolean {
        return Random.$.boolean();
    }

    public static create(seed?: number): Random {
        return new Random(seed);
    }

    public static float(): number {
        return Random.$.float();
    }

    public static gaussian(): number {
        return Random.$.gaussian();
    }

    public static int(num1: number, num2?: number): number {
        return Random.$.int(num1, num2);
    }

    public static number(num1: number, num2?: number): number {
        return Random.$.number(num1, num2);
    }

    public static probability(prob: number): boolean {
        return Random.$.probability(prob);
    }

    public boolean(): boolean {
        return this.random() >= 0.5;
    }

    public float(): number {
        return this.random();
    }

    public gaussian(): number {
        if (this.haveNextGaussian) {
            this.haveNextGaussian = false;
            return this.nextGaussian;
        } else {
            let v1, v2, s;
            do {
                v1 = 2 * this.float() - 1;
                v2 = 2 * this.float() - 1;
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);
            const multiplier = Math.sqrt(-2 * Math.log(s) / s);
            this.nextGaussian = v2 * multiplier;
            this.haveNextGaussian = true;
            return v1 * multiplier;
        }
    }

    public int(num1: number, num2?: number): number {
        if (num2 === undefined) {
            return Math.floor(this.random() * num1);
        } else {
            return Math.floor(this.random() * (num2 - num1)) + num1;
        }
    }

    public number(num1: number, num2?: number): number {
        if (num2 === undefined) {
            return this.random() * num1;
        } else {
            return this.random() * (num2 - num1) + num1;
        }
    }

    public probability(prob: number): boolean {
        if (prob === 0) {
            return false;
        }
        return this.random() <= 1 / prob;
    }

    public random(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}
