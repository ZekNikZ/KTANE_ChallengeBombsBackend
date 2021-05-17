import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import User from './User';

@Entity('access_tokens')
export default class AccessToken {
    @ManyToOne(() => User, (user) => user.tokens, { primary: true })
    owner!: User;

    @PrimaryColumn()
    name!: string;

    @Column({ unique: true })
    token!: string;

    constructor(owner: User, name: string, token: string) {
        this.owner = owner;
        this.name = name;
        this.token = token;
    }
}
