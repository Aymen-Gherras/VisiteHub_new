import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { PropertyOwner } from './property-owner.entity';
import { Property } from './property.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string; // URL-friendly name

  @Column({ nullable: true })
  imageUrl: string; // Project main image

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  // Relationships
  @ManyToOne(() => PropertyOwner, (owner) => owner.projects, { onDelete: 'CASCADE' })
  propertyOwner: PropertyOwner;

  @OneToMany(() => Property, (property) => property.project)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
