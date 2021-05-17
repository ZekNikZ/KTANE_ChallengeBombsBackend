import Role from '../enums/Role';

export function checkRole(role: Role, minRole: Role): boolean {
    return role >= minRole;
}

export default checkRole;
