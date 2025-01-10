import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import System from "../core/System";
import Item from "../item/Item";
import Slot from "../item/Slot";
import Color from "../utility/Color";
import Display from "./Display";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import Game from "../core/Game";

class InventorySlot extends PIXI.Container {
    public index = 0;
    public item?: Item;
    public slot: Slot;
    private itemContainer = new PIXI.Container();
    private itemSprite?: PIXI.Sprite;

    constructor(slot: Slot, index = 0) {
        super();
        this.index = index;
        this.slot = slot;
        this.buttonMode = true;
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(4, 4, 10, 10);
        this.itemContainer.position.set(4, 4);
        this.itemContainer.width = 8;
        this.itemContainer.height = 8;
        this.addChild(this.itemContainer);
        this.itemContainer.filters = [new DropShadowFilter({blur: 0, distance: 2, rotation: 45, quality: 0})];
    }

    public update(): void {
        if (this.item === this.slot.item) return;
        this.item = this.slot.item;
        this.itemContainer.removeChildren();
        if (this.slot.item) {
            this.itemSprite = this.slot.item.getSprite();
            this.itemContainer.addChild(this.itemSprite);
        }
    }
}

export default class HotbarDisplay extends Display {
    public hasCommand = true;
    private itemText?: PIXI.BitmapText;
    private nbSlot = 9;
    private selectSprite?: PIXI.Sprite;
    private slots: InventorySlot[] = [];
    private textDelay = 0;

    constructor() {
        super();
        this.init();
        this.onResize();
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("HOTBAR-1").clicked) Game.player.inventory.indexedSlot = 0;
        if (Game.input.getKey("HOTBAR-2").clicked) Game.player.inventory.indexedSlot = 1;
        if (Game.input.getKey("HOTBAR-3").clicked) Game.player.inventory.indexedSlot = 2;
        if (Game.input.getKey("HOTBAR-4").clicked) Game.player.inventory.indexedSlot = 3;
        if (Game.input.getKey("HOTBAR-5").clicked) Game.player.inventory.indexedSlot = 4;
        if (Game.input.getKey("HOTBAR-6").clicked) Game.player.inventory.indexedSlot = 5;
        if (Game.input.getKey("HOTBAR-7").clicked) Game.player.inventory.indexedSlot = 6;
        if (Game.input.getKey("HOTBAR-8").clicked) Game.player.inventory.indexedSlot = 7;
        if (Game.input.getKey("HOTBAR-9").clicked) Game.player.inventory.indexedSlot = 8;
        if (Game.input.getKey("DROP-ONE").clicked) {
            const slot = Game.player.inventory.selectedSlot();
            if (slot.isItem()) {
                const level = Game.player.getLevel();
                if (level && slot.item) {
                    Game.player.dropItem(slot.item);
                }
            }
        }
        if (Game.mouse.deltaY > 0) {
            Game.player.inventory.indexedSlot = (Game.player.inventory.indexedSlot + 1 + this.nbSlot) % this.nbSlot;
        }
        if (Game.mouse.deltaY < 0) {
            Game.player.inventory.indexedSlot = (Game.player.inventory.indexedSlot - 1 + this.nbSlot) % this.nbSlot;
        }
    }

    public onRender(): void {
        super.onRender();
        this.setCurrentSlot();
    }

    public onResize(): void {
        super.onResize();
        this.position.x = (Renderer.getScreen().width - this.width) >> 1;
        this.position.y = Renderer.getScreen().height - this.height - 20;
    }

    public onTick(): void {
        super.onTick();
        this.slots.forEach((slot) => slot.update());
    }

    private init(): void {
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "hotbar.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 112, 16)));
        this.selectSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(112, 0, 16, 16)));
        this.itemText = new PIXI.BitmapText("", {
            fontName: "Epic",
            fontSize: 16,
            tint: Color.white.getInt(),
        });
        this.itemText.anchor = 0.5;
        const bar = new PIXI.Container();
        bar.filters = [new DropShadowFilter({blur: 0, distance: 1, rotation: 90, quality: 0})];
        bar.addChild(sprite);
        for (let i = this.nbSlot - 1; i >= 0; i--) {
            const slot = Game.player.inventory.slots[i];
            const x = (i % this.nbSlot) * 12;
            const slotSprite = new InventorySlot(slot, i);
            slotSprite.on("click", () => {
                Game.player.inventory.indexedSlot = slotSprite.index;
            });
            slotSprite.position.set(x, 0);
            this.slots.push(slotSprite);
            bar.addChild(slotSprite);
        }
        bar.addChild(this.selectSprite);
        bar.scale.set(4);
        this.addChild(bar, this.itemText);
        this.itemText.position.set(this.width / 2, -12);
    }

    private setCurrentSlot(): void {
        const index = Game.player.inventory.indexedSlot;
        const slot = Game.player.inventory.getSlot(index);
        let text = "";
        if (this.textDelay > 0) this.textDelay--;
        this.itemText.visible = (this.textDelay > 0);
        if (this.itemText && slot.isItem()) text = `${slot.item?.getDisplayName()} - ${slot.nb}`;
        if (text !== this.itemText.text) {
            this.textDelay = 100;
            this.itemText.text = text;
        }
        if (this.selectSprite && this.selectSprite.x !== index * 12) {
            this.selectSprite.x -= (this.selectSprite.x - (index * 12)) / 2;
        }
    }
}
