declare global {
    interface String {

        equals(str: string): boolean;

        spinalCase(): string;
    }
}
String.prototype.spinalCase = function(): string {
    const str = String(this);
    let newStr = str[0];
    for (let j = 1; j < str.length; j++) {
        if (str[j].search(/\W/) !== -1 || str[j] === "_") {
            newStr += "-";
        } else if (str[j] === str[j].toUpperCase()) {
            if (str[j - 1].search(/\w/) !== -1 && str[j - 1] !== "_") {
                newStr += "-";
                newStr += str[j];
            } else {
                newStr += str[j];
            }
        } else {
            newStr += str[j];
        }
    }
    return newStr.toUpperCase();
};
String.prototype.equals = function(str: string): boolean {
    return String(this).valueOf() === String(str).valueOf();
};
export {};
