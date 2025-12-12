import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Index } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('visit_events')
export class VisitEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, { nullable: false, onDelete: 'CASCADE' })
  @Index('idx_visit_property')
  property: Property;

  @Column({ nullable: true })
  sessionId?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ip?: string;

  @Column({ nullable: true })
  wilaya?: string;

  @Column({ nullable: true })
  daira?: string;

  @Column({ type: 'int', nullable: true })
  durationSeconds?: number;

  @CreateDateColumn()
  createdAt: Date;
}


