import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Bomb from './Bomb';
import Pack from './Pack';
import Run from './Run';

@Entity('missions')
export default class Mission {
    @PrimaryColumn()
    missionId!: string;

    @Column()
    name!: string;

    @ManyToOne(() => Pack, (pack) => pack.missions, { onDelete: 'CASCADE' })
    pack!: Pack;

    @OneToMany(() => Bomb, (bomb) => bomb.mission, { cascade: ['insert'] })
    bombs!: Bomb[];

    @OneToMany(() => Run, (run) => run.mission)
    runs!: Run[];

    constructor(missionId: string, name: string, pack: Pack) {
        this.missionId = missionId;
        this.name = name;
        this.pack = pack;
    }
}
