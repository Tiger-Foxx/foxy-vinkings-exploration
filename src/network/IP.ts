import * as os from "os";
import {NetworkInterfaceInfoIPv4, NetworkInterfaceInfoIPv6} from "os";

export interface SubnetInfo {
    networkAddress: string;
    firstAddress: string;
    lastAddress: string;
    broadcastAddress: string;
    subnetMask: string;
    subnetMaskLength: number;
    numHosts: number;
    length: number;

    contains(ip: string): boolean;
}

export default class IP {

    private static ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    private static ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}))?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

    public static address(name?: string, family?: string): string {
        const ip = IP.ip(name, family);
        return ip ? ip.address : IP.loopback(family);
    }

    public static broadcast(name?: string, family?: string): string | undefined {
        const cidr = IP.ip(name, family)?.cidr;
        if (!cidr) return undefined;
        return IP.cidrSubnet(cidr).broadcastAddress;
    }

    public static cidr(cidrString: string): string {
        const cidrParts = cidrString.split("/");
        const addr = cidrParts[0];
        if (cidrParts.length !== 2) {
            throw new Error("invalid CIDR subnet: " + addr);
        }
        const mask = IP.fromPrefixLen(parseInt(cidrParts[1], 10));
        return IP.mask(addr, mask);
    }

    public static cidrSubnet(cidrString: string): SubnetInfo {
        const cidrParts = cidrString.split("/");

        const addr = cidrParts[0];
        if (cidrParts.length !== 2) {
            throw new Error("invalid CIDR subnet: " + addr);
        }
        const mask = IP.fromPrefixLen(parseInt(cidrParts[1], 10));
        return IP.subnet(addr, mask);
    }

    public static fromLong(ipl: number): string {
        return ((ipl >>> 24) + "." +
            (ipl >> 16 & 255) + "." +
            (ipl >> 8 & 255) + "." +
            (ipl & 255));
    }

    public static fromPrefixLen(prefixLen: number, family?: string): string {
        if (prefixLen > 32) {
            family = "ipv6";
        } else {
            family = IP._normalizeFamily(family);
        }

        let len = 4;
        if (family === "ipv6") {
            len = 16;
        }
        const buff = new Buffer(len);

        for (let i = 0, n = buff.length; i < n; ++i) {
            let bits = 8;
            if (prefixLen < 8) {
                bits = prefixLen;
            }
            prefixLen -= bits;

            buff[i] = ~(0xff >> bits) & 0xff;
        }

        return IP.toString(buff);
    }

    public static ip(name?: string, family?: string): undefined | NetworkInterfaceInfoIPv4 | NetworkInterfaceInfoIPv6 {
        const interfaces = os.networkInterfaces();
        family = IP._normalizeFamily(family);

        if (name && name !== "private" && name !== "public") {
            const inter = interfaces[name];
            if (!inter) return undefined;
            const res = inter.filter((details) => {
                const itemFamily = details.family.toLowerCase();
                return itemFamily === family;
            });
            if (res.length === 0) return undefined;
            return res[0];
        }

        const all = Object.keys(interfaces).map((nic) => {
            const inter = interfaces[nic];
            if (!inter) return undefined;
            const addresses = inter.filter((details) => {
                if (details.family.toLowerCase() !== family || IP.isLoopback(details.address)) {
                    return false;
                } else if (!name) return true;
                return name === "public" ? IP.isPrivate(details.address) : IP.isPublic(details.address);
            });

            return addresses.length ? addresses[0] : undefined;
        }).filter(Boolean);

        return !all.length ? undefined : all[0];
    }

    public static isEqual(a: string, b: string): boolean {
        let aBuffer = IP.toBuffer(a);
        let bBuffer = IP.toBuffer(b);

        // Same protocol
        if (aBuffer.length === bBuffer.length) {
            for (let i = 0; i < aBuffer.length; i++) {
                if (aBuffer[i] !== bBuffer[i]) return false;
            }
            return true;
        }

        // Swap
        if (bBuffer.length === 4) {
            const t = bBuffer;
            bBuffer = aBuffer;
            aBuffer = t;
        }

        // a - IPv4, b - IPv6
        for (let i = 0; i < 10; i++) {
            if (bBuffer[i] !== 0) return false;
        }

        const word = bBuffer.readUInt16BE(10);
        if (word !== 0 && word !== 0xffff) return false;

        for (let i = 0; i < 4; i++) {
            if (aBuffer[i] !== bBuffer[i + 12]) return false;
        }

        return true;
    }

    public static isLoopback(addr: string): boolean {
        return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
            .test(addr) ||
            /^fe80::1$/.test(addr) ||
            /^::1$/.test(addr) ||
            /^::$/.test(addr);
    }

    public static isPrivate(addr: string): boolean {
        return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i
            .test(addr) ||
            /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
            /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
                .test(addr) ||
            /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
            /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
            /^f[cd][0-9a-f]{2}:/i.test(addr) ||
            /^fe80:/i.test(addr) ||
            /^::1$/.test(addr) ||
            /^::$/.test(addr);
    }

    public static isPublic(addr: string): boolean {
        return !IP.isPrivate(addr);
    }

    public static isV4Format(ip: string): boolean {
        return this.ipv4Regex.test(ip);
    }

    public static isV6Format(ip: string): boolean {
        return this.ipv6Regex.test(ip);
    }

    public static loopback(family?: string): "127.0.0.1" | "fe80::1" {
        family = IP._normalizeFamily(family);
        if (family !== "ipv4" && family !== "ipv6") {
            throw new Error("family must be ipv4 or ipv6");
        }
        return family === "ipv4" ? "127.0.0.1" : "fe80::1";
    }

    public static mask(addr: string, mask: string): string {
        const addrBuffer = IP.toBuffer(addr);
        const maskBuffer = IP.toBuffer(mask);

        const result = new Buffer(Math.max(addrBuffer.length, maskBuffer.length));

        let i: number;
        // Same protocol - do bitwise and
        if (addrBuffer.length === maskBuffer.length) {
            for (i = 0; i < addrBuffer.length; i++) {
                result[i] = addrBuffer[i] & maskBuffer[i];
            }
        } else if (maskBuffer.length === 4) {
            // IPv6 address and IPv4 mask
            // (Mask low bits)
            for (i = 0; i < maskBuffer.length; i++) {
                result[i] = addrBuffer[addrBuffer.length - 4 + i] & maskBuffer[i];
            }
        } else {
            // IPv6 mask and IPv4 addr
            for (let j = 0; j < result.length - 6; j++) {
                result[j] = 0;
            }

            // ::ffff:ipv4
            result[10] = 0xff;
            result[11] = 0xff;
            for (i = 0; i < addrBuffer.length; i++) {
                result[i + 12] = addrBuffer[i] & maskBuffer[i + 12];
            }
            i = i + 12;
        }
        for (; i < result.length; i++) {
            result[i] = 0;
        }

        return IP.toString(result);
    }

    public static not(addr: string): string {
        const buff = IP.toBuffer(addr);
        for (let i = 0; i < buff.length; i++) {
            buff[i] = 0xff ^ buff[i];
        }
        return IP.toString(buff);
    }

    public static or(a: string, b: string): string {
        const aBuffer = IP.toBuffer(a);
        const bBuffer = IP.toBuffer(b);

        // same protocol
        if (aBuffer.length === bBuffer.length) {
            for (let i = 0; i < aBuffer.length; ++i) {
                aBuffer[i] |= bBuffer[i];
            }
            return IP.toString(aBuffer);

            // mixed protocols
        } else {
            let buff = aBuffer;
            let other = bBuffer;
            if (bBuffer.length > aBuffer.length) {
                buff = bBuffer;
                other = aBuffer;
            }

            const offset = buff.length - other.length;
            for (let i = offset; i < buff.length; ++i) {
                buff[i] |= other[i - offset];
            }

            return IP.toString(buff);
        }
    }

    public static subnet(addr: string, mask: string): SubnetInfo {
        const networkAddress = IP.toLong(IP.mask(addr, mask));

        // Calculate the mask's length.
        const maskBuffer = IP.toBuffer(mask);
        let maskLength = 0;

        for (const maskBuff of maskBuffer) {
            if (maskBuff === 0xff) {
                maskLength += 8;
            } else {
                let octet = maskBuff & 0xff;
                while (octet) {
                    octet = (octet << 1) & 0xff;
                    maskLength++;
                }
            }
        }

        const numberOfAddresses = Math.pow(2, 32 - maskLength);

        return {
            networkAddress: IP.fromLong(networkAddress),
            firstAddress: numberOfAddresses <= 2 ?
                IP.fromLong(networkAddress) :
                IP.fromLong(networkAddress + 1),
            lastAddress: numberOfAddresses <= 2 ?
                IP.fromLong(networkAddress + numberOfAddresses - 1) :
                IP.fromLong(networkAddress + numberOfAddresses - 2),
            broadcastAddress: IP.fromLong(networkAddress + numberOfAddresses - 1),
            subnetMask: mask,
            subnetMaskLength: maskLength,
            numHosts: numberOfAddresses <= 2 ?
                numberOfAddresses : numberOfAddresses - 2,
            length: numberOfAddresses,
            contains(other: string) {
                return networkAddress === IP.toLong(IP.mask(other, mask));
            },
        };
    }

    public static toBuffer(ip: string, buff?: Buffer, offset = 0): Buffer {
        offset = ~~offset;

        let result;

        if (this.isV4Format(ip)) {
            result = buff || new Buffer(offset + 4);
            ip.split(/\./g).map((byte) => {
                result[offset++] = parseInt(byte, 10) & 0xff;
            });
        } else if (this.isV6Format(ip)) {
            const sections = ip.split(":", 8);

            let i;
            for (i = 0; i < sections.length; i++) {
                const isv4 = this.isV4Format(sections[i]);
                let v4Buffer;

                if (isv4) {
                    v4Buffer = this.toBuffer(sections[i]);
                    sections[i] = v4Buffer.slice(0, 2).toString("hex");
                }

                if (v4Buffer && ++i < 8) {
                    sections.splice(i, 0, v4Buffer.slice(2, 4).toString("hex"));
                }
            }

            if (sections[0] === "") {
                while (sections.length < 8) {
                    sections.unshift("0");
                }
            } else if (sections[sections.length - 1] === "") {
                while (sections.length < 8) {
                    sections.push("0");
                }
            } else if (sections.length < 8) {
                for (i = 0; i < sections.length && sections[i] !== ""; i++) ;
                const argv: [number, number, ...string[]] = [i, 1];
                for (i = 9 - sections.length; i > 0; i--) {
                    argv.push("0");
                }
                sections.splice(...argv);
            }

            result = buff || new Buffer(offset + 16);
            for (i = 0; i < sections.length; i++) {
                const word = parseInt(sections[i], 16);
                result[offset++] = (word >> 8) & 0xff;
                result[offset++] = word & 0xff;
            }
        }

        if (!result) {
            throw Error("Invalid ip address: " + ip);
        }

        return result;
    }

    public static toLong(ip: string): number {
        let ipl = 0;
        ip.split(".").forEach((octet) => {
            ipl <<= 8;
            ipl += parseInt(octet, 10);
        });
        return (ipl >>> 0);
    }

    public static toString(buff: Buffer, offset = 0, length?: number): string {
        offset = ~~offset;
        length = length || (buff.length - offset);

        let result: any[] | string = [];
        if (length === 4) {
            // IPv4
            for (let i = 0; i < length; i++) {
                result.push(buff[offset + i]);
            }
            result = result.join(".");
        } else if (length === 16) {
            // IPv6
            for (let i = 0; i < length; i += 2) {
                result.push(buff.readUInt16BE(offset + i).toString(16));
            }
            result = result.join(":");
            result = result.replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3");
            result = result.replace(/:{3,4}/, "::");
        }

        return result as string;
    }

    private static _normalizeFamily(family?: string) {
        return family ? family.toLowerCase() : "ipv4";
    }
}
