import Bomb from '../models/Bomb';
import Mission from '../models/Mission';
import Pool from '../models/Pool';
import { atLeast } from '../../util/checks';
import checkProps from '../../util/checkProps';
import { parsePool } from './pool';

export function parseBomb(
    rawBomb: Partial<Bomb>,
    mission?: Mission
): Bomb | undefined {
    // Check structure
    if (
        !checkProps(
            rawBomb,
            'order',
            'repeat',
            'initialTime',
            'strikeCount',
            'pools'
        ) ||
        !Array.isArray(rawBomb.pools)
    ) {
        return;
    }

    // Validate arguments
    const { order, repeat, initialTime, strikeCount, pools } = rawBomb;
    if (!order || !atLeast(order, 0)) {
        return;
    } else if (!repeat || !atLeast(repeat, 1)) {
        return;
    } else if (!initialTime || !atLeast(initialTime, 1)) {
        return;
    } else if (!strikeCount || !atLeast(strikeCount, 1)) {
        return;
    }

    // Create new bomb
    const bomb = new Bomb(order, repeat, initialTime, strikeCount, mission);

    // Parse pools
    const parsedPools: Pool[] = [];
    for (const pool of pools) {
        const parsedPool = parsePool(pool, bomb);

        if (parsedPool) {
            parsedPools.push(parsedPool);
        } else {
            return;
        }
    }

    // Attach pools
    bomb.pools = parsedPools;

    return bomb;
}
