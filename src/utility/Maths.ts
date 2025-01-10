import Vector from "./Vector";
import Vector3D from "./Vector3D";

export default class Maths {
    public static abs(n: number): number {
        return Number(n < 0 ? n * -1 : n);
    }

    public static vector(x: number, y: number): Vector {
        return new Vector(x, y);
    }

    public static vector3d(x: number, y: number, z: number): Vector3D {
        return new Vector3D(x, y, z);
    }
}
