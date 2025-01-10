export default class Direction {
    public static DOWN: Direction = new Direction(0, 1, 0);
    public static LEFT: Direction = new Direction(-1, 0, 2);
    public static NONE: Direction = new Direction(0, 0, -1);
    public static RIGHT: Direction = new Direction(1, 0, 3);
    public static UP: Direction = new Direction(0, -1, 1);
    private readonly num: number;
    private readonly x: number;
    private readonly y: number;

    constructor(x: number, y: number, num = -1) {
        this.x = x;
        this.y = y;
        this.num = num;
    }

    public static getDirection(xd: number, yd: number): Direction {
        if (xd === 0 && yd === 0) {
            return Direction.NONE;
        } // the attack was from the same entity, probably; or at least the exact same space.

        if (Math.abs(xd) > Math.abs(yd)) {
            // the x distance is more prominent than the y distance
            if (xd < 0) {
                return Direction.LEFT;
            } else {
                return Direction.RIGHT;
            }
        } else {
            if (yd < 0) {
                return Direction.UP;
            } else {
                return Direction.DOWN;
            }
        }
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public isX(): boolean {
        return this.y === 0 && this.x !== 0;
    }

    public isY(): boolean {
        return this.x === 0 && this.y !== 0;
    }

    public toString(): string {
        return `${this.valueOf()}`;
    }

    public valueOf(): number {
        return this.num;
    }
}
