import User from '../models/User';
import { getRepository } from 'typeorm';

export async function getOrCreateUser(
    id: string,
    username?: string,
    avatar?: string | null | undefined
): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id);

    if (user) {
        if (username) {
            user.username = username;
        }
        if (avatar) {
            user.avatar = avatar;
        }

        await userRepository.save(user);
        return await userRepository.findOne(id);
    } else if (!username) {
        return undefined;
    }

    await userRepository.save(new User(id, username));
    return await userRepository.findOne(id);
}
