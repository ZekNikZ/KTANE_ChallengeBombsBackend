import Pack from '../models/Pack';
import User from '../models/User';
import { getRepository } from 'typeorm';

export async function createPack(
    owner: User,
    name: string,
    workshopURL: string,
    previewURL: string
): Promise<Pack> {
    return await getRepository(Pack).save(
        new Pack(name, owner, workshopURL, previewURL)
    );
}

export async function getAllPacks(): Promise<Pack[]> {
    return await getRepository(Pack).find();
}

export async function getPack(name: string): Promise<Pack | undefined> {
    return await getRepository(Pack).findOne({ name });
}

export async function updatePack(
    pack: Pack,
    updates: Record<string, unknown>
): Promise<Pack | undefined> {
    for (const prop in updates) {
        if (prop in pack) {
            pack = Object.assign(pack, { prop: updates[prop] });
        } else {
            return;
        }
    }

    return await getRepository(Pack).save(pack);
}

export async function deletePack(pack: Pack): Promise<boolean> {
    try {
        await getRepository(Pack).delete(pack);
        return true;
    } catch (error) {
        return false;
    }
}
