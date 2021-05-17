import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Mission from './Mission';
import RunStatus from '../../enums/RunStatus';
import User from './User';

@Entity('runs')
export default class Run {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: RunStatus, default: RunStatus.UNVERIFIED })
    status!: RunStatus;

    @Column('character varying', { nullable: true })
    logURL!: string | undefined;

    @Column('character varying', { nullable: true })
    videoURL!: string | undefined;

    @Column('int')
    millisRemaining!: number;

    @Column('int')
    millisRTATime!: number;

    @Column('smallint')
    strikeCount!: number;

    @Column('character varying', { nullable: true })
    notes!: string | undefined;

    @ManyToOne(() => Mission, (mission) => mission.runs)
    mission!: Mission;

    @ManyToOne(() => User, (user) => user.defuserRuns)
    defuser!: User;

    @ManyToMany(() => User, (user) => user.expertRuns)
    @JoinTable()
    experts!: User[];

    constructor(
        mission: Mission,
        millisRemaining: number,
        millisRTATime: number,
        strikeCount: number,
        defuser: User,
        experts: User[],
        logURL?: string,
        videoURL?: string,
        notes?: string
    ) {
        this.mission = mission;
        this.millisRemaining = millisRemaining;
        this.millisRTATime = millisRTATime;
        this.strikeCount = strikeCount;
        this.defuser = defuser;
        this.experts = experts;
        this.logURL = logURL;
        this.videoURL = videoURL;
        this.notes = notes;
    }
}
