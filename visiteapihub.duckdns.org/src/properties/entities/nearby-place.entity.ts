import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Property } from './property.entity';

@Entity('nearby_places')
@Index('idx_nearby_places_display_order', ['property', 'displayOrder'])
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

  @Column({ type: 'varchar', length: 255, default: '', nullable: false, name: 'icon' })
  icon: string; // Icon emoji or SVG filename (e.g., '📍' or 'bus.svg')

  @Column({ type: 'int', default: 0, name: 'display_order' })
  displayOrder: number; // For sorting

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

