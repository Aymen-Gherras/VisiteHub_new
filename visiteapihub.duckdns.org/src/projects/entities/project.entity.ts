import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Promoteur } from '../../promoteurs/entities/promoteur.entity';

export type ProjectStatus = 'completed' | 'construction' | 'planning' | 'suspended';

@Entity('projects')
@Index(['promoteurId'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  promoteurId: string;

  @ManyToOne(() => Promoteur, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promoteurId' })
  promoteur: Promoteur;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: '' })
  wilaya: string;

  @Column({ default: '' })
  daira: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: ['completed', 'construction', 'planning', 'suspended'],
    default: 'planning',
  })
  status: ProjectStatus;

  @Column({ type: 'text', nullable: true })
  coverImage: string;

  @Column({ type: 'int', nullable: true })
  totalUnits: number;

  @Column({ type: 'int', nullable: true })
  availableUnits: number;

  @Column({ nullable: true })
  deliveryDate: string;

  @Column({ type: 'int', nullable: true })
  floorsCount: number;

  @Column({ type: 'int', nullable: true })
  unitsPerFloor: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
