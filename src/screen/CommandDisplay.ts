import * as PIXI from "pixi.js";
import Display from "./Display";
import Updater from "../core/Updater";
import Game from "../core/Game";
import Color from "../utility/Color";
import Renderer from "../core/Renderer";
import Command from "../core/io/Command";

export default class CommandDisplay extends Display {

    public hasCommand = true;
    private cursorEnd: number;
    private cursorStart: number;
    private cursorTicks: number;
    private historicCommand: string[] = [];
    private historicResult: string[] = [];
    private input: HTMLInputElement;
    private inputText: PIXI.BitmapText;
    private selectIndex = 0;

    constructor() {
        super();
        this.input = CommandDisplay.createInput();
        this.init();
    }

    public get message(): string {
        return this.input.value;
    }

    public static createInput(): HTMLInputElement {
        const _commandInput = document.createElement("input");
        _commandInput.id = "command";
        _commandInput.type = "text";
        _commandInput.style.position = "absolute";
        _commandInput.style.left = "-1000px";
        _commandInput.style.top = "-1000px";
        document.body.appendChild(_commandInput);
        return _commandInput;
    }

    public clear(): void {
        this.input.value = "";
        this.inputText.text = "";
    }

    public execute(): boolean {
        if (this.message === "") return false;
        this.selectIndex = 0;
        this.historicCommand.unshift(this.message);
        this.historicResult.unshift(this.message);

        const commands = this.message.split("/");
        commands.shift();
        for (const command of commands) {
            const args = command.split(" ");
            const name = args.shift();
            const result = Command.execute(this, name, args);
            [].concat(result).forEach((res) => {
                if (res === undefined) return;
                this.historicResult.unshift(res.toString());
            });
        }
        this.clear();
    }

    public hide(): void {
        super.hide();
        this.clear();
        this.input.blur();
        Game.input.preventDefault = true;
    }

    public isBlocking(): boolean {
        return true;
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("EXIT").clicked) this.hide();
        if (!this.active) return;
        if (Game.input.getKey("ENTER").clicked) this.execute();
        if (Game.input.getKey("CURSOR-UP").clicked) {
            if (this.selectIndex < this.historicCommand.length) this.selectIndex++;
            if (this.historicCommand[this.selectIndex - 1]) {
                this.input.value = this.historicCommand[this.selectIndex - 1];
            }
        }
        if (Game.input.getKey("CURSOR-DOWN").clicked) {
            if (this.selectIndex > 1) this.selectIndex--;
            if (this.historicCommand[this.selectIndex - 1]) {
                this.input.value = this.historicCommand[this.selectIndex - 1];
            }
        }
    }

    public onRender(): void {
        super.onRender();
    }

    public onResize(): void {
        super.onResize();
        this.inputText.y = Renderer.getScreen().height;
    }

    public onTick(): void {
        super.onTick();
        while (this.historicResult.length > 15) {
            this.historicResult.pop();
        }
        if (Updater.every(100)) this.historicResult.pop();
        if (this.active) this.input.focus();

        this.inputText.text = [...this.historicResult].reverse().join("\n") + "\n" + ">" + this.message;

        if (!this.active) return;

        if (this.input.selectionStart !== this.cursorStart) {
            this.cursorStart = this.input.selectionStart;
            this.cursorTicks = 0;
        }
        if (this.input.selectionEnd !== this.cursorEnd) {
            this.cursorEnd = this.input.selectionEnd;
        }
    }

    public sendMessage(msg?: unknown): void {
        if (msg === undefined) return;
        this.historicResult.unshift(msg.toString());
    }

    public show(): void {
        super.show();
        this.clear();
        Game.input.preventDefault = false;
    }

    private init(): void {
        this.inputText = new PIXI.BitmapText("", {
            fontName: "Epic",
            fontSize: 16,
            tint: Color.white.getInt(),
        });
        this.inputText.anchor = new PIXI.Point(0, 1);
        this.addChild(this.inputText);
        this.onResize();
    }
}
