import Game from "./Game";
import System from "./System";
import Time from "./Time";

export default class Updater {
    public static readonly dayLength: number = 15000;
    public static delta: number;
    public static tickCount: number = Time.DAY.start;
    public static ticks = 0;
    public static time: Time = Time.MORNING;
    private static ticksTime: number[] = [];

    public static every(tick: number): boolean {
        return (this.tickCount % tick) === 0;
    }

    public static getDayRatio(): number {
        return this.tickCount / this.dayLength;
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static getPercentUsage(): number {
        return this.getTickTime()<<1;
    }

    public static onTick(dlt: number): void {
        const t1 = System.milliTime();
        this.delta = dlt;
        if (!Game.isFocus) return;
        Game.GUI.onTick();
        Game.level?.onTick();
        Game.input.onTick();
        Game.mouse.onTick();
        this.setTime(this.tickCount + 1);
        this.ticks++;
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static setTime(ticks: number): void {
        if (ticks < Time.MORNING.start) ticks = 0;
        if (ticks < Time.DAY.start) {
            this.time = Time.MORNING;
        } else if (ticks < Time.EVENING.start) {
            this.time = Time.DAY;
        } else if (ticks < Time.NIGHT.start) {
            this.time = Time.EVENING;
        } else if (ticks < this.dayLength) {
            this.time = Time.NIGHT;
        } else {
            this.time = Time.MORNING;
            ticks = 0;
        }
        this.tickCount = ticks;
    }
}
