import Bomb from '../models/Bomb';
import Pool from '../models/Pool';
import { atLeast } from '../../util/checks';
import checkProps from '../../util/checkProps';

export function parsePool(
    rawPool: Partial<Pool>,
    bomb: Bomb
): Pool | undefined {
    // Check structure
    if (
        !checkProps(rawPool, 'count', 'modules') ||
        !Array.isArray(rawPool.modules)
    ) {
        return;
    }
    const { count, modules } = rawPool;

    // Validate arguments
    if (!count || !atLeast(count, 1)) {
        return;
    }

    // Create new pool
    return new Pool(bomb, count, modules);
}
