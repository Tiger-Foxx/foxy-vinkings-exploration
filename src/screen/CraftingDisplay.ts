import * as PIXI from "pixi.js";
import Display from "./Display";
import {Mob} from "../entity";
import Recipe from "../crafting/Recipe";
import System from "../core/System";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

export default class CraftingDisplay extends Display {
    public hasCommand = true;
    private background: PIXI.Sprite;
    private container: PIXI.Container;
    private costContainer = new PIXI.Container();
    private hasText: PIXI.BitmapText;
    private readonly mob: Mob;
    private readonly recipes: Recipe[];
    private recipesContainer = new PIXI.Container();
    private selected = 0;
    private selectSprite: PIXI.Sprite;

    constructor(recipes: Recipe[], mob: Mob) {
        super();
        this.mob = mob;
        this.recipes = Array.from(recipes);
        this.recipes.forEach((recipe) => recipe.checkCanCraft(mob));
        this.recipes.sort((r1, r2) => {
            if (r1.canCraft && !r2.canCraft) return -1;
            if (!r1.canCraft && r2.canCraft) return 1;
            return 0;
        });
        this.init();
    }

    public isBlocking(): boolean {
        return true;
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("CURSOR-DOWN").clicked || Game.mouse.deltaY > 0) {
            this.setSelect((this.selected + 1 + this.recipes.length) % this.recipes.length);
        }
        if (Game.input.getKey("CURSOR-UP").clicked || Game.mouse.deltaY < 0) {
            this.setSelect((this.selected - 1 + this.recipes.length) % this.recipes.length);
        }
        if (Game.input.getKey("EXIT").clicked) this.hide();

        if (Game.input.getKey("ENTER").clicked) {
            const r = this.recipes[this.selected];
            if (r.canCraft && r.craft(this.mob)) {
                console.log("CRAFT");
                r.deductCost(this.mob);
                this.refresh();
            }
        }
    }

    public onRender(): void {
        super.onRender();
    }

    public onResize(): void {
        super.onResize();
        this.background.width = Renderer.getScreen().width;
        this.background.height = Renderer.getScreen().height;
        this.container.position.set(
            (Renderer.getScreen().width - this.container.width) / 2,
            (Renderer.getScreen().height - this.container.height) / 2,
        );
    }

    private init(): void {
        this.container = new PIXI.Container();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "crafting.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 192, 112)));
        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = 0x000000;
        this.background.alpha = 0.75;
        this.selectSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 112, 128, 16)));
        this.costContainer.position.set(135, 29);
        this.recipesContainer.position.set(7, 7);
        this.hasText = new PIXI.BitmapText("", {
            fontName: "Epic",
            fontSize: 6,
            tint: 0xffffff,
        });
        this.hasText.anchor = new PIXI.Point(0, 0.5);
        this.hasText.position.set(150, 12);
        this.container.addChild(sprite, this.costContainer, this.selectSprite, this.recipesContainer, this.hasText);
        this.container.scale.set(4);
        this.addChild(this.background, this.container);
        this.initRecipe();
        this.setSelect(0, true);
        this.onResize();
    }

    private initCost(recipe: Recipe): void {
        if (this.recipes.length === 0) return;
        this.costContainer.removeChildren();
        recipe.cost.forEach(([itemRegister, number], index) => {
            const item = itemRegister.item;
            const itemSprite = item.getSprite();
            itemSprite.x = 0;
            itemSprite.y = index * 10;
            const has = this.mob.inventory.count(item);
            const itemText = new PIXI.BitmapText(`${number}/${has}`, {
                fontName: "Epic",
                fontSize: 6,
                tint: has >= number ? 0xffffff : 0xb4b4b4,
            });
            itemText.anchor = new PIXI.Point(0, 0.5);
            itemText.x = 10;
            itemText.y = index * 10 + 5;
            this.costContainer.addChild(itemSprite, itemText);
        });
    }

    private initRecipe(): void {
        if (this.recipes.length === 0) return;
        const maxRow = Math.min(10, this.recipes.length);
        this.recipesContainer.removeChildren();
        for (let i = 0; i < maxRow; i++) {
            let n = i;
            if (this.selected - (maxRow - 1) > 0) n += this.selected - (maxRow - 1);
            if (n === this.selected) this.selectSprite.position.y = i * 10 + 3;
            const recipe = this.recipes[n];
            const item = recipe.result.item;
            const itemSprite = item.getSprite();
            itemSprite.x = 0;
            itemSprite.y = i * 10;
            const itemText = new PIXI.BitmapText(item.getDisplayName().toUpperCase(), {
                fontName: "Epic",
                fontSize: 4,
                tint: recipe.canCraft ? 0xffffff : 0xa67948,
            });
            itemText.anchor = new PIXI.Point(0, 0.5);
            itemText.position.set(10, i * 10 + 5);
            this.recipesContainer.addChild(itemSprite, itemText);
        }
        this.hasText.text = `${this.mob.inventory.count(this.recipes[this.selected].result.item)}`;
    }

    private refresh(): void {
        this.recipes.forEach((recipe) => recipe.checkCanCraft(this.mob));
        this.initRecipe();
        this.initCost(this.recipes[this.selected]);
    }

    private setSelect(val: number, force = false): void {
        if (!force && val === this.selected) return;
        this.selected = val;
        this.refresh();
    }
}
