import {Entity} from "../entity";

class Node {
    public f = 0;
    public g = 0;
    public h = 0;
    public readonly parent?: Node;
    public readonly pos: number[];

    constructor(parent?: Node, position: number[] = []) {
        this.parent = parent;
        this.pos = position;
    }

    public isSame(node: Node) {
        if (this.pos === node.pos) return true;
        if (!this.pos || !node.pos) return false;
        return (this.pos[0] === node.pos[0] && this.pos[1] === node.pos[1]);
    }
}

export default class PathFinding {
    public static astar(entity: Entity, end: [number, number]): number[][] | any[] {
        const startNode = new Node(undefined, [entity.x >> 4, entity.y >> 4]);
        const endNode = new Node(undefined, end);
        const openList: Node[] = [];
        const closedList: Node[] = [];
        openList.push(startNode);
        let count = 0;
        while (openList.length > 0) {
            if (count++ > 1000) return [];
            let currentNode = openList[0];
            openList.forEach((item) => {
                if (item.f < currentNode.f) currentNode = item;
            });
            openList.splice(openList.indexOf(currentNode), 1);
            closedList.push(currentNode);
            if (currentNode.isSame(endNode)) {
                const path: number[][] = [];
                let current = currentNode;
                while (current) {
                    path.push(current.pos);
                    current = current.parent;
                }
                return path.reverse();
            }
            const children = [];
            for (const newPosition of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                const nodePosition = [
                    currentNode.pos[0] + newPosition[0],
                    currentNode.pos[1] + newPosition[1],
                ];
                const tile = entity.getLevel()?.getTile(nodePosition[0], nodePosition[1]);
                if (!(tile && tile.mayPass(entity))) continue;
                const newNode = new Node(currentNode, nodePosition);
                children.push(newNode);
            }

            for (const child of children) {
                if (closedList.some((closedChild) => closedChild.isSame(child))) continue;
                child.g = currentNode.g + 1;
                child.h = ((child.pos[0] - endNode.pos[0]) ** 2) + ((child.pos[1] - endNode.pos[1]) ** 2);
                child.f = child.g + child.h;
                if (openList.some((openNode) => openNode.isSame(child) && child.g > openNode.g)) continue;
                openList.push(child);
            }
        }
        return [];
    }
}
