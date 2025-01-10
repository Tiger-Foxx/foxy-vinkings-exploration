import ArrayEntry from "./entry/ArrayEntry";
import BooleanEntry from "./entry/BooleanEntry";
import Entry from "./entry/Entry";
import NumberEntry from "./entry/NumberEntry";
import RangeEntry from "./entry/RangeEntry";
import StringEntry from "./entry/StringEntry";
import Language from "./io/Language";

class Settings {

    private options = new Map<string, Entry>();

    constructor() {
        this.options.set("sound", new BooleanEntry("Sound", true));
        this.options.set("fps", new RangeEntry("Max FPS", 10, 300, 30));
        this.options.set("diff", new ArrayEntry("Difficulty", "Easy", "Normal", "Hard"));
        this.options.set("name", new StringEntry("World Name", "My World"));
        this.options.set("port", new NumberEntry("Server Port", 2250));
        this.options.set("lang", new ArrayEntry("Language", Language.all));
    }

    public get(option: string): any {
        return this.getEntry(option)?.getValue();
    }

    public getEntry(option: string): Entry | undefined {
        return this.options.get(option.toLowerCase());
    }

    public getIdx(option: string): number {
        const entry = this.getEntry(option);
        if (entry instanceof ArrayEntry) {
            return entry.getSelection();
        }
        return 0;
    }
}

export default new Settings();

