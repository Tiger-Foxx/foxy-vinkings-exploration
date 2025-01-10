import Language from "./Language";

export default class Localization {

    public static languages: Language[] = Language.all;

    public static get(id: string): string {
        return Language.loaded?.get(id) ?? id;
    }

    public static getCurrent(): Language | undefined {
        return Language.loaded;
    }

    public static loadLanguage(lang: Language | string): void {
        if (lang instanceof Language) {
            lang.load();
        } else {
            Language.find(lang)?.load();
        }
    }

    public static verify(id: string): boolean {
        return Language.loaded?.has(id) ?? false;
    }
}
