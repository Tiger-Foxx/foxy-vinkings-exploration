import {OptionsJson} from "body-parser";
import express from "express";
import http from "http";
import socketio from "socket.io";
import Game from "../core/Game";
import Settings from "../core/Settings";
import Random from "../utility/Random";
import ServerUDP from "./ServerUDP";
import IP from "./IP";
import uniqid from "uniqid";
import Renderer from "../core/Renderer";

export default class Server {

    private io: socketio.Server;
    private name = "MY SUPER SERVER";
    private port: number;
    private readonly server: http.Server;
    private udp = new ServerUDP(this);
    private uid: string = uniqid();

    constructor() {
        Game.isOnline = true;
        Game.isHost = true;
        this.port = Settings.get("port");

        const app = express();
        this.server = new http.Server(app);
        this.server.once("error", (err: { code: string; }) => {
            if (err.code === "EADDRINUSE") {
                console.log("Port " + this.port + " is already used");
                this.port = Random.int(8999, 9999);
                Settings.getEntry("port")?.setValue(this.port);
                this.server.listen(this.port);
            }
        });
        this.server.once("listening", () => {
            console.log(IP.broadcast());
            console.log(`Server started on ${IP.address()}:${this.port}`);
        });

        this.io = socketio(this.server, {});

        app.get("/status", (req: any, res: any) => {
            res.json({
                name: this.name,
                version: Game.version.toString(),
                online: Game.isOnline,
                ip: IP.address(),
                port: this.port,
            } as OptionsJson);
        });

        app.get("/stream", (req: any, res: any) => {
            res.type("video/webm");
            Renderer.createStream().pipe(res, {end: false});
        });
    }

    public endConnection(): void {
        console.log("Server closing in 3s");
        setTimeout(() => {
            this.server.close(() => {
                console.log("Server closed!");
            });
        }, 3000);
    }

    public getPacketUDP(): Buffer {
        return Buffer.from(JSON.stringify({
            uid: this.uid,
            ip: IP.address(),
            port: this.port,
        }));
    }

    public hasClients(): boolean {
        return this.io.sockets.clients.length > 0;
    }

    public startConnection(): void {
        this.udp.startConnection();
        this.server.listen(this.port);
    }
}
