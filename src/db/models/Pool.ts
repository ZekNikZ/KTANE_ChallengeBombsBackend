import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Bomb from './Bomb';

@Entity('pools')
export default class Pool {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Bomb, (bomb) => bomb.pools, { onDelete: 'CASCADE' })
    bomb!: Bomb;

    @Column('smallint')
    count!: number;

    @Column('character varying', { array: true })
    modules!: string[];

    constructor(bomb: Bomb, count: number, modules: string[] = []) {
        this.bomb = bomb;
        this.count = count;
        this.modules = modules;
    }
}
