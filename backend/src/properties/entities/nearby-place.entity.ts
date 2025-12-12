import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity('nearby_places')
export class NearbyPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.nearbyPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ nullable: false })
  name: string; // "Place Taksim"

  @Column({ nullable: false })
  distance: string; // "300 m", "1.5 km"

  @Column({ type: 'varchar', length: 10, default: '📍', nullable: false, name: 'icon' })
  icon: string; // Icon emoji for the nearby place

  @Column({ type: 'int', default: 0, name: 'display_order' })
  displayOrder: number; // For sorting

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

