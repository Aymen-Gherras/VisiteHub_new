import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

export type ContactClickType = 'PHONE' | 'WHATSAPP';

@Entity('contact_click_events')
export class ContactClickEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, { nullable: false, onDelete: 'CASCADE' })
  @Index('idx_contact_click_property')
  property: Property;

  @Column({ type: 'enum', enum: ['PHONE', 'WHATSAPP'] })
  @Index('idx_contact_click_type')
  type: ContactClickType;

  @CreateDateColumn()
  createdAt: Date;
}
