import io from "socket.io-client";
import Game from "../core/Game";

export default class Client {

    private readonly socket: SocketIOClient.Socket;

    constructor(username: string, hostName: string) {
        Game.isOnline = true;
        Game.isHost = false;
        this.socket = io(hostName, {
            query: {},
        });
        this.socket.on("connect", (d: any) => {
            console.log(d);
            console.log("Connected to ");
        });
    }

    private static openSocket(host: string): any {
        console.log(host);
        return io(host, {
            query: {},
        });
    }

    public endConnection(): void {
        this.socket.close();
    }

    public isConnected(): boolean {
        return this.socket != null && !this.socket.disconnected && this.socket.connected;
    }

}
