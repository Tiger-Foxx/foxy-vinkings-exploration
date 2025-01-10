import electron from "electron";

const app: electron.App = (electron.app || electron.remote.app);

export default class Version {

    private readonly major: number = 0;
    private readonly minor: number = 0;
    private readonly patch: number = 0;
    private readonly valid: boolean = true;

    constructor(version: string) {
        const nums: string[] = version.split(".");
        try {
            if (nums[0]) this.major = Version.parseInt(nums[0]);
            if (nums[1]) this.minor = Version.parseInt(nums[1]);
            if (nums[2]) this.patch = Version.parseInt(nums[2]);
        } catch (e) {
            this.valid = false;
        }
    }

    public static fromConfig(): Version {
        return new Version(process.env.npm_package_version ?? app.getVersion());
    }

    private static compare(a: number, b: number): number {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }

    private static Number(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return Number(n);
    }

    private static parseInt(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return parseInt(n, 10);
    }

    public compareTo(ov: Version): number {
        if (this.major !== ov.major) {
            return Version.compare(this.major, ov.major);
        }
        if (this.minor !== ov.minor) {
            return Version.compare(this.minor, ov.minor);
        }
        if (this.patch !== ov.patch) {
            if (this.patch === 0) {
                return 1;
            }
            if (ov.patch === 0) {
                return -1;
            }
            return Version.compare(this.patch, ov.patch);
        }
        return 0;
    }

    public isValid(): boolean {
        return this.valid;
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}
