import User from '../models/User';
import { getRepository } from 'typeorm';

export async function getOrCreateUser(
    id: string,
    username?: string,
    avatarURL?: string | null | undefined
): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id);

    if (user) {
        if (username) {
            user.username = username;
        }
        if (avatarURL) {
            user.avatarURL = avatarURL;
        }

        await userRepository.save(user);
        return await userRepository.findOne(id);
    } else if (!username) {
        return undefined;
    }

    await userRepository.save(new User(id, username));
    return await userRepository.findOne(id);
}

export async function getUser(id: string): Promise<User | undefined> {
    return await getRepository(User).findOne(id);
}
