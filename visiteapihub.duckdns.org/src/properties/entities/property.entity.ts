import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { NearbyPlace } from './nearby-place.entity';

export enum PropertyType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  HOUSE = 'house',
  STUDIO = 'studio',
  LAND = 'terrain',
  COMMERCIAL = 'commercial',
}

export enum TransactionType {
  SALE = 'vendre',
  RENT = 'location',
}

@Entity('properties')
@Index(['wilaya'])
@Index(['daira'])
@Index(['transactionType'])
@Index(['type'])
@Index(['price'])
@Index(['createdAt'])
@Index(['isFeatured'])
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: false })
  surface: number;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.APARTMENT,
  })
  type: PropertyType;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.SALE,
  })
  transactionType: TransactionType;

  @Column({ type: 'varchar', length: 255, nullable: false })
  price: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ nullable: true })
  apartmentType: string; // F2, F3, F4, etc.

  @Column({ nullable: true })
  etage: number; // Floor number

  @Column({ nullable: false })
  wilaya: string;

  @Column({ default: 'Algeria' })
  country: string;

  @Column({ nullable: false })
  daira: string;

  @Column({ nullable: false })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  iframe360Link: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mainImage?: string;

  @Column({ type: 'json', nullable: true })
  images?: string[];

  @Column({ type: 'json', nullable: true })
  papers?: string[];

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({
    type: 'enum',
    enum: ['month', 'day'],
    default: 'month',
    nullable: true,
    comment: 'Rent period for rental properties (month or day)'
  })
  rentPeriod?: 'month' | 'day';

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'Particulier' })
  propertyOwnerType: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'

  @Column({ type: 'varchar', length: 255, nullable: true })
  propertyOwnerName?: string; // Name of agency or promotion company (only for 'Agence immobilière' or 'Promotion immobilière')

  @Column({ type: 'varchar', length: 36, nullable: true })
  projectId?: string;

  @OneToMany(() => NearbyPlace, (nearbyPlace) => nearbyPlace.property, { cascade: true })
  nearbyPlaces: NearbyPlace[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}