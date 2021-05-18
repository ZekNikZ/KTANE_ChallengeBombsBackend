import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Mission from './Mission';
import Pool from './Pool';

@Entity('bombs')
export default class Bomb {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Mission, (mission) => mission.bombs, {
        onDelete: 'CASCADE',
    })
    mission!: Mission;

    @Column('smallint')
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
        order: number,
        repeat: number,
        initialTime: number,
        strikeCount: number,
        mission?: Mission
    ) {
        this.order = order;
        this.repeat = repeat;
        this.initialTime = initialTime;
        this.strikeCount = strikeCount;

        if (mission) {
            this.mission = mission;
        }
    }
}
