import Bomb from '../models/Bomb';
import Mission from '../models/Mission';
import Pack from '../models/Pack';
import { getRepository } from 'typeorm';
import { parseBomb } from './bomb';

export async function createMission(
    missionId: string,
    pack: Pack,
    name: string,
    bombs: Partial<Bomb>[]
): Promise<Mission | undefined> {
    // Create the mission
    const mission = new Mission(missionId, name, pack);

    // Create the bombs
    const parsedBombs: Bomb[] = [];
    for (const bomb of bombs) {
        const parsedBomb = parseBomb(bomb, mission);

        if (parsedBomb) {
            parsedBombs.push(parsedBomb);
        } else {
            return;
        }
    }

    // Attach the bombs to the mission
    mission.bombs = parsedBombs;

    // Save mission
    return await getRepository(Mission).save(mission);
}

export async function getAllPackMissions(pack: Pack): Promise<Mission[]> {
    return await getRepository(Mission).find({ pack });
}

export async function deleteMission(mission: Mission): Promise<boolean> {
    try {
        await getRepository(Mission).delete(mission);
        return true;
    } catch (error) {
        return false;
    }
}
