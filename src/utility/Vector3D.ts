export default class Vector3D {
    public x = 0;
    public y = 0;
    public z = 0;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get magnitude(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    public set magnitude(mag: number) {
        if (this.magnitude === 0) {
            return;
        }
        this.x *= mag / this.magnitude;
        this.y *= mag / this.magnitude;
        this.z *= mag / this.magnitude;
    }

    public get rotation(): number {
        return Math.atan2(this.x, this.y);
    }

    public get2dMagnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    public toString(): string {
        return `x:${this.x.toFixed(2)} y:${this.y.toFixed(2)} z:${this.z.toFixed(2)}`;
    }
}
