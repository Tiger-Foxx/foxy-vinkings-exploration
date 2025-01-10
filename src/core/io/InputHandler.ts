import Game from "../Game";
import Key from "./Key";
import "./String";

export default class InputHandler {

    public preventDefault = true;
    private keyboard = new Map();
    private keymap = new Map();

    constructor() {
        this.initKeyMap();
        document.addEventListener("keyup", (e) => this.keyReleased(e));
        document.addEventListener("keydown", (e) => this.keyPressed(e));

        this.keyboard.set("SHIFT-LEFT", new Key(true));
        this.keyboard.set("CONTROL-LEFT", new Key(true));
        this.keyboard.set("ALT-LEFT", new Key(true));
    }

    private static isMod(keyName: string): boolean {
        keyName = keyName.toUpperCase();
        return keyName.equals("SHIFT-LEFT") || keyName.equals("CONTROL-LEFT") || keyName.equals("ALT-LEFT");
    }

    private static keyTyped(e: Event): void {
        e.preventDefault();
    }

    public getAllPressedKeys(): Key[] {
        const keys = [];
        for (const key of this.keyboard.values()) {
            if (key.down) {
                keys.push(key);
            }
        }
        return keys;
    }

    public getKey(keyText: string, getFromMap = true): Key {
        if (keyText == null || keyText.length === 0) {
            return new Key();
        }
        let key: Key;
        keyText = keyText.toUpperCase();

        if (getFromMap) {
            if (this.keymap.has(keyText)) {
                keyText = this.keymap.get(keyText);
            }
        }

        const fullKeyText: string = keyText;

        if (keyText.includes("|")) {
            key = new Key();
            for (const keypos of keyText.split("|")) {
                const aKey: Key = this.getKey(keypos, false);
                key.down = key.down || aKey.down;
                key.clicked = key.clicked || aKey.clicked;
            }
            return key;
        }


        if (keyText.includes("&")) {
            keyText = keyText.substring(keyText.lastIndexOf("&") + 1);
        }

        if (this.keyboard.has(keyText)) {
            key = this.keyboard.get(keyText);
        } else {
            key = new Key();
            this.keyboard.set(keyText, key);
            console.log(`Added new key: ${keyText}`);
        }


        keyText = fullKeyText;

        if (keyText.equals("SHIFT-LEFT") || keyText.equals("CONTROL-LEFT") || keyText.equals("ALT-LEFT")) {
            return key;
        }

        let foundS = false, foundC = false, foundA = false;
        if (keyText.includes("&")) {
            for (const keyName of keyText.split("&")) {
                if (keyName.equals("SHIFT-LEFT")) {
                    foundS = true;
                }
                if (keyName.equals("CONTROL-LEFT")) {
                    foundC = true;
                }
                if (keyName.equals("ALT-LEFT")) {
                    foundA = true;
                }
            }
        }

        const modMatch: boolean =
            this.getKey("SHIFT-LEFT").down === foundS &&
            this.getKey("CONTROL-LEFT").down === foundC &&
            this.getKey("ALT-LEFT").down === foundA;

        if (keyText.includes("&")) {
            const mainKey: Key = key;
            key = new Key();
            key.down = modMatch && mainKey.down;
            key.clicked = modMatch && mainKey.clicked;
        } else if (!modMatch) {
            key = new Key();
        }
        return key;
    }

    public onTick(): void {
        if (!Game.isFocus) {
            this.releaseAll();
        }
        for (const key of this.keyboard.values()) {
            key.onTick();
        }
    }

    public releaseAll(): void {
        for (const key of this.keyboard.values()) {
            key.release();
        }
    }

    public resetKeyBindings(): void {
        this.keymap.clear();
        this.initKeyMap();
    }

    private getPhysKey(keyText: string): Key {
        keyText = keyText.toUpperCase();
        if (this.keyboard.has(keyText)) {
            return this.keyboard.get(keyText);
        } else {
            return new Key();
        }
    }

    private initKeyMap(): void {
        this.keymap.set("MOVE-UP", "KEY-W|ARROW-UP");
        this.keymap.set("MOVE-DOWN", "KEY-S|ARROW-DOWN");
        this.keymap.set("MOVE-LEFT", "KEY-A|ARROW-LEFT");
        this.keymap.set("MOVE-RIGHT", "KEY-D|ARROW-RIGHT");

        this.keymap.set("JUMP", "SPACE");
        this.keymap.set("NEXT", "SPACE");

        this.keymap.set("CURSOR-UP", "ARROW-UP");
        this.keymap.set("CURSOR-DOWN", "ARROW-DOWN");
        this.keymap.set("CURSOR-LEFT", "ARROW-LEFT");
        this.keymap.set("CURSOR-RIGHT", "ARROW-RIGHT");

        this.keymap.set("SELECT", "ENTER");
        this.keymap.set("EXIT", "ESCAPE");

        this.keymap.set("ATTACK", "KEY-C|ENTER");
        this.keymap.set("INVENTORY", "KEY-E");
        this.keymap.set("CRAFT", "KEY-Z|SHIFT-LEFT&KEY-E");
        this.keymap.set("PICKUP", "KEY-V|KEY-P");
        this.keymap.set("DROP-ONE", "KEY-Q");
        this.keymap.set("DROP-STACK", "SHIFT-LEFT&KEY-Q");

        this.keymap.set("PAUSE", "ESCAPE");

        this.keymap.set("EXIT", "ESCAPE");
        this.keymap.set("POTION", "KEY-P");
        this.keymap.set("MAP", "KEY-M");
        this.keymap.set("INFO", "F-3");
        this.keymap.set("CHAT", "KEY-T");
        this.keymap.set("QUIT", "CONTROL-LEFT&KEY-Q");

        this.keymap.set("HOTBAR-1", "DIGIT-1");
        this.keymap.set("HOTBAR-2", "DIGIT-2");
        this.keymap.set("HOTBAR-3", "DIGIT-3");
        this.keymap.set("HOTBAR-4", "DIGIT-4");
        this.keymap.set("HOTBAR-5", "DIGIT-5");
        this.keymap.set("HOTBAR-6", "DIGIT-6");
        this.keymap.set("HOTBAR-7", "DIGIT-7");
        this.keymap.set("HOTBAR-8", "DIGIT-8");
        this.keymap.set("HOTBAR-9", "DIGIT-9");
    }

    private keyPressed(e: KeyboardEvent): void {
        if (this.preventDefault) e.preventDefault();
        this.toggle(e.code.spinalCase(), true);
    }

    private keyReleased(e: KeyboardEvent): void {
        if (this.preventDefault) e.preventDefault();
        this.toggle(e.code.spinalCase(), false);
    }


    private toggle(keyCode: string, pressed: boolean): void {
        const keytext: string = keyCode.toUpperCase();
        this.getPhysKey(keytext).toggle(pressed);
    }
}

