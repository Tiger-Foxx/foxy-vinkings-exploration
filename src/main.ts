import Game from "./core/Game";

document.addEventListener("DOMContentLoaded", () => {
    Game.main();
});
// @ts-ignore
global.game = Game;
