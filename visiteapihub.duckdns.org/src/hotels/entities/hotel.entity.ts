import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  @Column({ type: 'text', nullable: true })
  iframeUrl: string;

  @Column({ type: 'int', nullable: true })
  roomsNumber: number;

  @Column({ type: 'int', nullable: true })
  starsNumber: number;

  @Column({ nullable: true })
  coverImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
