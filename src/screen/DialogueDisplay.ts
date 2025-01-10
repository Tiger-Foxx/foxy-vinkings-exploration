import Display from "./Display";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Game from "../core/Game";

export class Dialogue {

    public hasCommand = true;
    public name: string;
    public sentences: string[] = [];

    public static create(name: string): Dialogue {
        return new Dialogue().setName(name);
    }

    public addSentence(text: string): this {
        this.sentences.push(text);
        return this;
    }

    public setName(name: string): this {
        this.name = name;
        return this;
    }

}

class TextAnimation {

    private delay = 1;
    private readonly onDone: () => void;
    private readonly onUpdate: (text: string, char?: string) => void;
    private outputText = "";
    private sourceText: string;
    private started = false;

    constructor(onUpdate: (text: string, char?: string) => void, onDone?: () => void) {
        this.onUpdate = onUpdate;
        this.onDone = onDone;
    }

    public onTick(): void {
        if (!this.started || !Updater.every(this.delay)) return;
        const i = this.outputText.length;
        const char = this.sourceText.charAt(i);
        this.outputText += char;
        this.onUpdate(this.outputText, char);
        if (this.outputText === this.sourceText) {
            this.started = false;
            if (this.onDone) this.onDone();
        }
    }

    public start(text: string): void {
        this.sourceText = text;
        this.outputText = "";
        this.started = true;
    }
}

export default class DialogueDisplay extends Display {
    public hasCommand = true;
    private animation: TextAnimation;
    private dialogue: Dialogue;
    private readonly nameArea: PIXI.BitmapText;
    private readonly next: PIXI.Sprite;
    private sentences: string[] = [];
    private readonly textArea: PIXI.BitmapText;

    constructor() {
        super();
        const container = new PIXI.Container();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "dialogue.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 192, 64)));
        this.next = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 64, 8, 8)));
        this.nameArea = new PIXI.BitmapText("Name", {
            fontName: "Epic",
            fontSize: 6,
            tint: 0xff9000,
        });
        this.nameArea.position.set(8, 4);
        this.textArea = new PIXI.BitmapText("Text Body", {
            fontName: "Epic",
            fontSize: 6,
            tint: 0xffffff,
        });
        this.textArea.maxWidth = 176;
        this.textArea.position.set(8, 16);
        this.next.position.set(179, 51);

        container.addChild(sprite, this.next, this.nameArea, this.textArea);
        container.scale.set(4);
        container.position.set(
            (Renderer.getScreen().width - container.width) / 2,
            (Renderer.getScreen().height - container.height) - 16,
        );
        this.addChild(container);

        const a = new AudioContext(); // browsers limit the number of concurrent audio contexts, so you better re-use'em

        function beep(vol: number, freq: number, duration: number) {
            const v = a.createOscillator();
            const u = a.createGain();
            v.connect(u);
            v.frequency.value = freq;
            v.type = "square";
            u.connect(a.destination);
            u.gain.value = vol * 0.01;
            v.start(a.currentTime);
            v.stop(a.currentTime + duration * 0.001);
        }


        this.animation = new TextAnimation(
            (text, char) => {
                this.textArea.text = text;
                if (char && char !== " ") beep(100, 600, 25);
            },
        );
    }

    public displayNextSentence(): void {
        if (this.sentences.length <= 0) return this.endDialogue();
        const sentence = this.sentences.shift();
        this.animation.start(sentence);
        console.log(sentence);
    }

    public endDialogue(): void {
        this.hide();
    }

    public isBlocking(): boolean {
        return true;
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("NEXT").clicked || Game.input.getKey("ENTER").clicked) this.displayNextSentence();
    }

    public onRender(): void {
        this.next.pivot.y = Math.sin(Renderer.ticks / 3) / 2;
    }

    public onTick(): void {
        this.animation.onTick();
    }

    public startDialogue(dialogue: Dialogue): void {
        if (!this.active) this.show();
        this.dialogue = dialogue;
        this.sentences.push(...this.dialogue.sentences);
        this.nameArea.text = dialogue.name;
        this.displayNextSentence();
    }
}
