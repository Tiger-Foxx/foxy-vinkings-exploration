import * as PIXI from "pixi.js";
import Inventory from "../item/Inventory";
import Item from "../item/Item";
import Slot from "../item/Slot";
import Renderer from "../core/Renderer";
import Display from "./Display";
import Game from "../core/Game";

class InventorySlot extends PIXI.Container {

    private item?: Item;
    private itemSprite?: PIXI.Sprite;
    private slot: Slot;

    constructor(slot: Slot) {
        super();
        this.slot = slot;
        this.buttonMode = true;
        this.interactive = true;
        this.on("click", (ev: any) => {
            if (this.slot.isItem()) {
                console.log(this.slot.item?.getDisplayName());
            }
        });
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite.width = 8;
        sprite.height = 8;
        sprite.alpha = 0.5;

        this.addChild(sprite);
    }

    public update(): void {
        if (this.item === this.slot.item) return;
        console.log("update");
        this.item = this.slot.item;
        if (this.itemSprite) this.removeChild(this.itemSprite);
        this.itemSprite = undefined;
        if (this.slot.isItem()) {
            this.itemSprite = this.slot.item?.getSprite();
            if (this.itemSprite) this.addChild(this.itemSprite);
        }
    }
}

export default class InventoryDisplay extends Display {
    public hasCommand = true;
    private inventory: Inventory;
    private slots: InventorySlot[] = [];

    constructor(inventory: Inventory) {
        super();
        this.inventory = inventory;
        this.init();
    }

    public isBlocking(): boolean {
        return true;
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("EXIT").clicked) this.hide();
    }

    public onTick(): void {
        super.onTick();
        this.slots.forEach((slot) => slot.update());
    }

    private init(): void {
        const container = new PIXI.Container();
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.width = Renderer.getScreen().width;
        background.height = Renderer.getScreen().height;
        background.tint = 0x000000;
        background.alpha = 0.75;

        const nbRow = 9;
        for (let i = 0; i < this.inventory.slots.length; i++) {
            const slot = this.inventory.slots[i];
            const x = (i % nbRow) * 10;
            const y = ~~(i / nbRow) * 10;
            const slotSprite = new InventorySlot(slot);
            slotSprite.position.set(x, y);
            this.slots.push(slotSprite);
            container.addChild(slotSprite);
        }

        container.scale.set(4);
        container.position.set(
            (Renderer.getScreen().width - container.width) / 2,
            (Renderer.getScreen().height - container.height) / 2,
        );
        this.addChild(background, container);
    }
}
