import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('restaurants')
export class Restaurant {
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

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  iframeUrl: string;

  @Column({ nullable: true })
  coverImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
