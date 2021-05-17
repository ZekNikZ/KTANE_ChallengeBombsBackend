import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

@Entity('webhooks')
export default class Webhook {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.webhooks)
    owner!: User;

    @Column()
    name!: string;

    @Column()
    url!: string;

    @Column('character varying', { array: true })
    events!: string[];

    constructor(owner: User, name: string, url: string, events: string[] = []) {
        this.owner = owner;
        this.name = name;
        this.url = url;
        this.events = events;
    }
}
