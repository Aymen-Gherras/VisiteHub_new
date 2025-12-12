import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DemandeStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  REJECTED = 'rejected',
}

export enum PropertyIntention {
  SELL = 'sell',
  RENT = 'rent',
}

@Entity('demandes')
export class Demande {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: false })
  propertyType: string;

  @Column({ nullable: false })
  propertyLocation: string;

  @Column({
    type: 'enum',
    enum: PropertyIntention,
    nullable: false,
  })
  propertyIntention: PropertyIntention;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ nullable: true })
  whatsappContact: boolean;

  @Column({ nullable: true })
  emailContact: boolean;

  @Column({
    type: 'enum',
    enum: DemandeStatus,
    default: DemandeStatus.PENDING,
  })
  status: DemandeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}