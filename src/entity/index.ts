import Chicken from "./mob/Chicken";
import Player from "./mob/Player";
import Zombie from "./mob/Zombie";
import Fish from "./mob/Fish";
import AquaticMob from "./mob/AquaticMob";
import HostileMob from "./mob/HostileMob";
import Mob from "./mob/Mob";
import ItemEntity from "./ItemEntity";
import Entity from "./Entity";
import Entities from "./Entities";
import Furniture from "./furniture/Furniture";
import Craftable from "./furniture/Craftable";
import Chest from "./furniture/Chest";
import Bed from "./furniture/Bed";
import Skeleton from "./mob/Skeleton";
import Hook from "./Hook";
import Camp from "./furniture/Camp";
import MusicPlayer from "./furniture/MusicPlayer";
import Bear from "./mob/Bear";
import Furnace from "./furniture/Furnace";
import Oven from "./furniture/Oven";
import Alembic from "./furniture/Alembic";
import Anvil from "./furniture/Anvil";
import Workbench from "./furniture/Workbench";

Entities.add(0, "player", Player);
Entities.add(1, "zombie", Zombie);
Entities.add(2, "skeleton", Skeleton);
Entities.add(3, "fish", Fish);
Entities.add(4, "itemEntity", ItemEntity);
Entities.add(5, "chicken", Chicken);
Entities.add(6, "bear", Bear);
Entities.add(7, "hook", Hook);
Entities.add(8, "chest", Chest);
Entities.add(9, "bed", Bed);
Entities.add(10, "camp", Camp);
Entities.add(11, "furnace", Furnace);
Entities.add(12, "oven", Oven);
Entities.add(13, "alembic", Alembic);
Entities.add(14, "anvil", Anvil);
Entities.add(15, "workbench", Workbench);
Entities.add(16, "musicPlayer", MusicPlayer);

export {
    Entity,
    ItemEntity,
    Mob,
    AquaticMob,
    Fish,
    HostileMob,
    Player,
    Zombie,
    Skeleton,
    Chicken,
    Bear,
    Furniture,
    Craftable,
    Chest,
    Bed,
    Hook,
    Camp,
    Furnace,
    Oven,
    Alembic,
    Anvil,
    Workbench,
    MusicPlayer,
};
