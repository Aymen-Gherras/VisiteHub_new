import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Promoteur } from './promoteur.entity';
import { Property } from '../../properties/entities/property.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  CONSTRUCTION = 'construction', 
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export enum ProjectType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED = 'mixed',
  INDUSTRIAL = 'industrial'
}

@Entity('projects')
@Index(['status'])
@Index(['wilaya'])
@Index(['promoteurId'])
@Index(['isActive'])
@Index(['projectType'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string; // URL-friendly name

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string; // Main project image

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Project gallery (Cloudinary URLs)

  @Column({ nullable: true })
  location: string; // Specific location within daira

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ 
    type: 'enum', 
    enum: ProjectStatus, 
    default: ProjectStatus.PLANNING 
  })
  status: ProjectStatus;

  @Column({ 
    type: 'enum', 
    enum: ProjectType, 
    default: ProjectType.RESIDENTIAL 
  })
  projectType: ProjectType;

  @Column({ type: 'int', default: 0 })
  totalUnits: number; // Total number of property units

  @Column({ type: 'int', default: 0 })
  availableUnits: number; // Available units for sale/rent

  @Column({ type: 'int', default: 0 })
  soldUnits: number; // Sold units

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minPrice: number; // Starting price

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxPrice: number; // Maximum price

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalBudget: number; // Total project budget

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number; // Completion percentage (0-100)

  @Column({ type: 'text', nullable: true })
  amenities: string; // JSON array of amenities

  @Column({ type: 'text', nullable: true })
  features: string; // JSON array of features

  @Column({ type: 'text', nullable: true })
  nearbyPlaces: string; // JSON array of nearby places

  @Column({ type: 'text', nullable: true })
  paymentPlans: string; // JSON array of payment plans

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ManyToOne(() => Promoteur, (promoteur) => promoteur.projects)
  promoteur: Promoteur;

  @Column({ type: 'uuid', nullable: true })
  promoteurId: string;

  @OneToMany(() => Property, (property) => property.project)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
