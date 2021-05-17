import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import AccessToken from './AccessToken';
import Pack from './Pack';
import Role from '../../enums/Role';
import Run from './Run';
import Webhook from './Webhook';

@Entity('users')
export default class User {
    @PrimaryColumn()
    id!: string;

    @Column()
    username!: string;

    @Column('character varying', { nullable: true })
    avatarURL!: string | null;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role!: Role;

    @OneToMany(() => AccessToken, (token) => token.owner)
    tokens!: AccessToken[];

    @OneToMany(() => Pack, (pack) => pack.owner)
    packs!: Pack[];

    @OneToMany(() => Run, (run) => run.defuser)
    defuserRuns!: Run[];

    @ManyToMany(() => Run, (run) => run.experts)
    expertRuns!: Run[];

    @OneToMany(() => Webhook, (webhook) => webhook.owner)
    webhooks!: Webhook[];

    constructor(
        id: string,
        username: string,
        avatarURL?: string | null | undefined,
        role?: Role
    ) {
        this.id = id;
        this.username = username;
        this.avatarURL = avatarURL || null;

        if (role) {
            this.role = role;
        }
    }
}
