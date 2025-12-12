import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Property } from './property.entity';
import { Project } from './project.entity';

export enum PropertyOwnerType {
  AGENCE = 'Agence immobilière',
  PROMOTEUR = 'Promotion immobilière'
}

@Entity('property_owners')
@Index(['ownerType'])
@Index(['slug'])
export class PropertyOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string; // URL-friendly name for SEO

  @Column({
    type: 'enum',
    enum: PropertyOwnerType
  })
  ownerType: PropertyOwnerType; // 'Agence immobilière' or 'Promotion immobilière'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string; // Logo/cover image from Cloudinary

  @Column({ nullable: true })
  coverImage: string; // Cover image for profile page

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  // One-to-many relationship with properties
  @OneToMany(() => Property, (property) => property.propertyOwner)
  properties: Property[];

  // One-to-many relationship with projects (only for promoteurs)
  @OneToMany(() => Project, (project) => project.propertyOwner)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
