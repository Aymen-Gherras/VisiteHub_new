import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('agences')
@Index(['wilaya'])
@Index(['isActive'])
export class Agence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Agency name

  @Column({ nullable: true, unique: true })
  slug: string; // URL-friendly name

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string; // Cloudinary URL

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  @Column({ type: 'text', nullable: true })
  socialMedia: string; // JSON string for social media links

  @Column({ nullable: true })
  licenseNumber: string; // Real estate license number

  @Column({ type: 'date', nullable: true })
  licenseExpiry: Date;

  @Column({ type: 'int', default: 0 })
  foundedYear: number;

  @Column({ type: 'int', default: 0 })
  agentCount: number; // Number of agents

  @Column({ type: 'text', nullable: true })
  specializations: string; // JSON array of specializations

  @Column({ type: 'text', nullable: true })
  serviceAreas: string; // JSON array of service areas

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // Average rating (0-5)

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @OneToMany(() => Property, (property) => property.agence)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
