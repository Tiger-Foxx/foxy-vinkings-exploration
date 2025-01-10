import * as PIXI from "pixi.js";
import Display from "./Display";
import {Mob} from "../entity";
import System from "../core/System";
import Game from "../core/Game";
import Renderer from "../core/Renderer";
import Inventory from "../item/Inventory";

enum Direction {
    LEFT,
    RIGHT,
}

class Container extends PIXI.Container {

    private readonly container: PIXI.Container;
    private inventory: Inventory;
    private readonly selectSprite: PIXI.Sprite;

    constructor(inventory: Inventory, x = 0, y = 0, direction: Direction = Direction.LEFT) {
        super();
        this.position.set(x, y);
        this.width = 88;
        this.height = 100;
        this.inventory = inventory;
        this.container = new PIXI.Container();
        if (direction === Direction.LEFT) {
            this.selectSprite = new PIXI.Sprite(
                new PIXI.Texture(ContainerDisplay.baseTexture, new PIXI.Rectangle(0, 112, 192, 16)),
            );
        } else {
            this.selectSprite = new PIXI.Sprite(
                new PIXI.Texture(ContainerDisplay.baseTexture, new PIXI.Rectangle(0, 128, 192, 16)),
            );
        }
        this.selectSprite.pivot.set(x, y);
        this.addChild(this.selectSprite, this.container);
    }

    private _select = 0;

    public get select(): number {
        return this._select;
    }

    public set select(value: number) {
        const max = this.getSlots().length;
        value = (value + max) % max;
        this._select = isNaN(value) ? 0 : value;
        this.refresh();
    }

    private _selected = true;

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        this._selected = value;
        this.selectSprite.visible = value;
    }

    public onCommand(): void {
        if (Game.input.getKey("CURSOR-DOWN").clicked || Game.mouse.deltaY > 0) this.select++;
        if (Game.input.getKey("CURSOR-UP").clicked || Game.mouse.deltaY < 0) this.select--;
    }

    public refresh() {
        const maxRow = 10;
        this.container.removeChildren();

        for (let i = 0; i < maxRow; i++) {
            let n = i;
            if (this.select - (maxRow - 1) > 0) n += this.select - (maxRow - 1);
            if (n === this.select) {
                this.selectSprite.position.y = i * 10 + 3;
            }
            const slot = this.getSlots()[n];
            if (!slot || !slot.item) continue;
            const item = slot.item;
            const itemSprite = item.getSprite();
            itemSprite.x = 0;
            itemSprite.y = i * 10;
            const itemText = new PIXI.BitmapText(item.getDisplayName().toUpperCase(), {
                fontName: "Epic",
                fontSize: 4,
                tint: 0xffffff,
            });
            itemText.anchor = new PIXI.Point(0, 0.5);
            itemText.position.set(10, i * 10 + 5);
            this.container.addChild(itemSprite, itemText);
        }
    }

    public swap(A: Container) {
        const slot = this.getSlot();
        if (!slot?.isItem()) return;
        const item = slot.item;
        if (A.inventory.addItem(item) && this.inventory.removeItem(item)) {
            const max = this.getSlots().length;
            if (this.select >= max) this.select = max - 1;
            this.refresh();
            A.refresh();
        }
        return false;
    }

    private getSlot() {
        return this.getSlots()[this.select];
    }

    private getSlots() {
        return this.inventory.slots.filter((slot) => slot.isItem());
    }
}

export default class ContainerDisplay extends Display {
    public static baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "container.png"));
    public hasCommand = true;
    private container: Container[] = [];

    constructor(mob: Mob, inventory: Inventory) {
        super();
        this.container.push(
            new Container(mob.inventory, 7, 7, Direction.LEFT),
            new Container(inventory, 99, 7, Direction.RIGHT),
        );
        this.init();
    }

    private static moveItem(A: Container, B: Container) {
        if (A.selected) {
            A.swap(B);
        } else {
            B.swap(A);
        }
    }

    public isBlocking(): boolean {
        return true;
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("CURSOR-LEFT").clicked) {
            this.selectWindow(0);
        }
        if (Game.input.getKey("CURSOR-RIGHT").clicked) {
            this.selectWindow(1);
        }
        if (Game.input.getKey("EXIT").clicked) this.hide();

        if (Game.input.getKey("ENTER").clicked) {
            ContainerDisplay.moveItem(this.container[0], this.container[1]);
        }

        this.container.forEach((container) => {
            if (container.selected) {
                container.onCommand();
            }
        });
    }

    private init() {
        const container = new PIXI.Container();
        const sprite = new PIXI.Sprite(
            new PIXI.Texture(ContainerDisplay.baseTexture, new PIXI.Rectangle(0, 0, 192, 112)),
        );
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.width = Renderer.getScreen().width;
        background.height = Renderer.getScreen().height;
        background.tint = 0x000000;
        background.alpha = 0.75;

        container.addChild(sprite, ...[...this.container].reverse());
        this.container.forEach((c) => c.refresh());
        container.scale.set(4);
        container.position.set(
            (Renderer.getScreen().width - container.width) / 2,
            (Renderer.getScreen().height - container.height) / 2,
        );
        this.addChild(background, container);
        this.selectWindow(0);
    }

    private selectWindow(windowId: number) {
        this.container.forEach((container, index) => {
            container.selected = index === windowId;
        });
    }
}
