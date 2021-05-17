import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Bomb from './Bomb';

@Entity('pools')
export default class Pool {
    @ManyToOne(() => Bomb, (bomb) => bomb.pools, { primary: true })
    bomb!: Bomb;

    @PrimaryColumn('smallint')
    count!: number;

    @Column('character varying', { array: true })
    modules!: string[];

    constructor(bomb: Bomb, count: number, modules: string[] = []) {
        this.bomb = bomb;
        this.count = count;
        this.modules = modules;
    }
}
