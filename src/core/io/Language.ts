import fs from "fs";
import YAML from "yaml";
import System from "../System";

export default class Language {
    public static all: Language[] = (() => {
        return fs.readdirSync(System.getResource("lang")).map((file) => new Language(file));
    })();
    public static loaded?: Language = Language.all[0];
    public isLoaded = false;
    private data = new Map<string, any>();
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    public static find(name: string): Language | undefined {
        return Language.all.find((lang) => lang.path === name);
    }

    private static loadFile(path: string): string {
        return fs.readFileSync(System.getResource("lang", path), "utf8");
    }

    public get(id: string): string {
        if (this.data.has(id)) {
            return this.data.get(id);
        }
        console.warn(`'${id}' didnt exist on ${this.path}`);
        return id;
    }

    public getPath(): string {
        return this.path;
    }

    public has(id: string): boolean {
        return this.data.has(id);
    }

    public load(): Language {
        if (Language.loaded instanceof Language) {
            Language.loaded.unLoad();
        }
        if (this.isLoaded) {
            return this;
        }
        this.isLoaded = true;
        Language.loaded = this;
        this.data = new Map(Object.entries(YAML.parse(Language.loadFile(this.path))));
        return this;
    }

    public unLoad(): Language {
        this.data.clear();
        this.isLoaded = false;
        if (Language.loaded === this) {
            Language.loaded = undefined;
        }
        return this;
    }
}
