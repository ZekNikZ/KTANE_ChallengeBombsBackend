import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Mission from './Mission';
import Pool from './Pool';

@Entity('bombs')
export default class Bomb {
    @ManyToOne(() => Mission, (mission) => mission.bombs, { primary: true })
    mission!: Mission;

    @PrimaryColumn('smallint')
    order!: number;

    @Column('smallint')
    repeat!: number;

    @Column('int')
    initialTime!: number;

    @Column('smallint')
    strikeCount!: number;

    @OneToMany(() => Pool, (pool) => pool.bomb)
    pools!: Pool[];

    constructor(
        mission: Mission,
        order: number,
        repeat: number,
        initialTime: number,
        strikeCount: number
    ) {
        this.mission = mission;
        this.order = order;
        this.repeat = repeat;
        this.initialTime = initialTime;
        this.strikeCount = strikeCount;
    }
}
