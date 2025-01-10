import Entities from "../../entity/Entities";
import Game from "../Game";
import {clipboard, remote} from "electron";
import Initializer from "../Initializer";
import System from "../System";
import CommandDisplay from "../../screen/CommandDisplay";


export default class Command {

    private static commandList: Map<string, Command> = new Map<string, Command>();
    private callback?: (args: any[], display: CommandDisplay) => any;
    private readonly name: string;

    constructor(commandName: string) {
        this.name = commandName;
        Command.commandList.set(commandName, this);
    }

    public static add(commandName: string): Command {
        return new Command(commandName);
    }

    public static execute(display: CommandDisplay, commandName: string, args: any[] = []): any {
        const command = this.commandList.get(commandName);
        if (!command) return `"${commandName}" unknown`;
        return command.execute(args, display);
    }

    public static getAll(): Map<string, Command> {
        return this.commandList;
    }

    public addFunction(callback: (args: any[], display: CommandDisplay) => any): boolean {
        if (callback instanceof Function) {
            this.callback = callback;
            return true;
        }
        return false;
    }

    public execute(args: any[] = [], display: CommandDisplay): any {
        if (this.callback instanceof Function) {
            return this.callback(args, display);
        }
        return false;
    }

    public getName(): string {
        return this.name;
    }
}

Command.add("help").addFunction((args, display) => {
    Command.getAll().forEach((command) => {
        display.sendMessage(command.getName());
    });
});

Command.add("hello").addFunction(() => "world");

Command.add("summon").addFunction((args) => {
    const entityClass = Entities.getByTag(args[0]);
    if (entityClass) {
        const nb = isNaN(parseInt(args[1], 10)) ? 1 : parseInt(args[1], 10);
        for (let i = 0; i < nb; i++) {
            try {
                Game.level.add(new entityClass(), Game.player.x, Game.player.y);
            } catch (e) {
                return false;
            }
        }
        return `Summon ${nb} ${entityClass.name}`;
    }
    return false;
});

Command.add("seed").addFunction(() => {
    const seed = Game.level.seed.toString();
    clipboard.writeText(seed);
    return seed;
});

Command.add("speed").addFunction((args) => {
    let speed = parseInt(args[0], 10);
    if (isNaN(speed)) speed = 1;
    Initializer.setSpeed(speed);
    return speed;
});

Command.add("tp").addFunction((args) => {
    const x = parseInt(args[0], 10);
    const y = parseInt(args[1], 10);
    Game.player.x = x << 4;
    Game.player.y = y << 4;
    return `Teleported to ${x} ${y}`;
});

Command.add("refresh").addFunction((args, display) => {
    Game.level.flushChunks().then(() => {
        display.sendMessage("done");
    });
    return "pending...";
});

Command.add("save").addFunction((args, display) => {
    Game.level.save().then(() => {
        display.sendMessage("done");
    }).catch((e) => display.sendMessage(e));
    return "pending...";
});

Command.add("deleteSave").addFunction((args, display) => {
    Game.level.flushChunks().then(() => {
        Game.level.deleteTempDir();
        display.sendMessage("done");
    });
    return "pending...";
});

Command.add("setLevel").addFunction((args) => {
    const id = parseInt(args[0], 10);
    Game.changeLevel(id);
    return `Set level to ${id}`;
});

Command.add("folder").addFunction(() => {
    remote.shell.showItemInFolder(System.getAppData("tmp"));
    return "";
});
