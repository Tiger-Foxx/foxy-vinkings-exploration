import udp from "dgram";
import IP from "./IP";

interface ServerPacket {
    ip: string;
    port: number;
    uid: string;
}

export default class SearchServer {
    private static PORT = 20000;

    private static results: ServerPacket[] = [];
    private static searching = false;
    private static timer?: NodeJS.Timeout;

    public static getResults(): ServerPacket[] {
        return this.results;
    }

    public static start(callback?: (server: ServerPacket) => void): SearchServer {
        if (this.searching) return this;
        this.results = [];
        this.searching = true;
        const client = udp.createSocket({type: "udp4", reuseAddr: true});
        const data = new Buffer(0);
        this.timer = setInterval(() => {
            client.send(data, 0, data.length, this.PORT, IP.broadcast(), (error) => {
                if (error) console.error(error);
            });
        }, 5000);
        client.on("message", (msg, info) => {
            const packet = JSON.parse(msg.toString());
            if (this.results.find((result) => result.uid === packet.uid)) {
                return;
            }
            this.results.push(packet);
            if (callback instanceof Function) {
                callback(packet);
            }
        });
        return this;
    }

    public static stop(): void {
        this.searching = false;
        if (this.timer) clearInterval(this.timer);
    }
}

