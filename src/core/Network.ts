import Server from "../network/Server";
import Game from "./Game";

export default class Network {
    public static startMultiplayerServer(): void {
        Game.server = new Server();
        Game.server.startConnection();
    }
}
