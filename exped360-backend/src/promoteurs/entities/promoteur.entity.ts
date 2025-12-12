import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Project } from './project.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity('promoteurs')
@Index(['slug'], { unique: true })
@Index(['name'])
export class Promoteur {
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
  coverImage: string; // Cover image for promoteur profile

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

  @OneToMany(() => Project, (project) => project.promoteur, { cascade: true })
  projects: Project[];

  @OneToMany(() => Property, (property) => property.promoteur)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
