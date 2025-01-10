import * as PIXI from "pixi.js";
import Items from "../item/Items";
import Crafting from "../crafting/Crafting";
import {Player} from "../entity/";
import Biome from "../level/biome/Biome";
import Level from "../level/Level";
import Client from "../network/Client";
import Server from "../network/Server";
import Version from "../saveload/Version";
import Initializer from "./Initializer";
import InputHandler from "./io/InputHandler";
import Localization from "./io/Localization";
import Network from "./Network";
import System from "./System";
import Renderer from "./Renderer";
import MouseHandler from "./io/MouseHandler";
import GUI from "./GUI";
import Seed from "../utility/Seed";
import LevelGenCave from "../level/levelGen/LevelGenCave";
import LevelGenOverworld from "../level/levelGen/LevelGenOverworld";

export default class Game {
    public static client?: Client;
    public static currentLevel = 0;
    public static GUI: GUI;
    public static input: InputHandler;
    public static isFocus = false;
    public static isHost = false;
    public static isOnline = false;

    public static level: Level;
    public static levels: Level[] = [];
    public static mouse: MouseHandler;
    public static readonly NAME: string = "The Epic Adventure";
    public static player: Player;
    public static running = true;
    public static server?: Server;
    public static readonly version: Version = Version.fromConfig();

    public static changeLevel(id: number): void {
        this.level.deleteTempDir();
        this.level.remove(this.player);
        this.level.flushChunks().then(() => {
            console.log("DONE");
        });
        this.currentLevel = id;
        this.level = this.levels[this.currentLevel];
        this.level.add(this.player);
        Renderer.setLevel(this.level);
    }

    public static hasConnectedClients(): boolean {
        return Boolean(this.isValidServer() && this.server?.hasClients());
    }

    public static isConnectedClient(): boolean {
        return Boolean(this.isValidClient() && this.client?.isConnected());
    }

    public static isValidClient(): boolean {
        return this.isOnline && this.client != null;
    }

    public static isValidServer(): boolean {
        return Boolean(this.isOnline && this.isHost && this.server);
    }

    public static main(): void {
        console.info(`\n${this.NAME} ${this.version.toString()}\nA game by Maxime Scharwath\n`);
        Crafting.initRecipes();
        Biome.initBiomeList();
        Localization.loadLanguage("en-US.yaml");
        Items.verifyTag();
        this.levels = [];
        this.input = new InputHandler();
        this.mouse = new MouseHandler();
        this.GUI = new GUI();
        this.player = new Player();
        this.levels.push(
            new Level(Seed.create(123456789), LevelGenOverworld),
            new Level(Seed.create(123456789), LevelGenCave),
        );
        this.level = this.levels[this.currentLevel];
        this.level.deleteTempDir();
        this.level.add(this.player, 0, 0, true);
        Renderer.setLevel(this.level);
        Initializer.createAndDisplayFrame();
        Network.startMultiplayerServer();
        PIXI.Loader.shared.add("Epic", System.getResource("font", "epic.xml")).load(() => {
            this.GUI.init();
            Initializer.run();
        });

        /*        window.addEventListener("beforeunload", (e) => {
                    e.preventDefault();
                    this.quit().finally(() => {
                        remote.getCurrentWindow().destroy();
                    });
                    e.returnValue = true;
                });*/
    }

    public static quit(): Promise<void[][]> {
        if (this.isValidServer()) {
            this.server?.endConnection();
        }
        if (this.isConnectedClient()) {
            this.client?.endConnection();
        }
        this.running = false;
        return Promise.all(this.levels.map(((level) => level.save())));
    }
}
