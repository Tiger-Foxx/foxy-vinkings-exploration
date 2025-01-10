import PotionType from "../item/PotionType";

export default class PotionEffect {
    public duration: number;
    public readonly type: PotionType;

    constructor(potionType: PotionType) {
        this.type = potionType;
        this.duration = potionType.duration;
    }

    public remainingPercent(): number {
        return this.duration / this.type.duration * 100;
    }
}
