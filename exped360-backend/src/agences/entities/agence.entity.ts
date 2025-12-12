import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('agences')
@Index(['slug'], { unique: true })
@Index(['name'])
@Index(['wilaya'])
export class Agence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string; // Cloudinary URL

  @Column({ nullable: true })
  coverImage: string; // Cover image for agence profile

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

  @Column({ type: 'simple-array', nullable: true })
  specializations: string[]; // e.g., ['Résidentiel', 'Commercial', 'Terrain']

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @OneToMany(() => Property, (property) => property.agence)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
