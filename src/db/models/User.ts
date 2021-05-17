import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import AccessToken from './AccessToken';
import Role from '../../roles/Role';

@Entity('users')
export default class User {
    @PrimaryColumn()
    id!: string;

    @Column()
    username!: string;

    @Column('character varying', { nullable: true })
    avatar!: string | null;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role!: Role;

    @OneToMany(() => AccessToken, (token) => token.owner)
    tokens!: AccessToken[];

    constructor(
        id: string,
        username: string,
        avatar?: string | null | undefined,
        role?: Role
    ) {
        this.id = id;
        this.username = username;
        this.avatar = avatar || null;

        if (role) {
            this.role = role;
        }
    }
}
