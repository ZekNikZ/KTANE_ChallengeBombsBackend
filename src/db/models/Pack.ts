import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Mission from './Mission';
import User from './User';

@Entity('packs')
export default class Pack {
    @PrimaryColumn()
    name!: string;

    @Column({ default: false })
    approved!: boolean;

    @Column()
    workshopURL!: string;

    @Column('character varying', { nullable: true })
    previewURL!: string | undefined;

    @ManyToOne(() => User, (user) => user.packs, { onDelete: 'NO ACTION' })
    owner!: User;

    @OneToMany(() => Mission, (mission) => mission.pack)
    missions!: Mission[];

    constructor(
        name: string,
        owner: User,
        workshopURL: string,
        previewURL?: string
    ) {
        this.name = name;
        this.owner = owner;
        this.workshopURL = workshopURL;
        this.previewURL = previewURL;
    }
}
