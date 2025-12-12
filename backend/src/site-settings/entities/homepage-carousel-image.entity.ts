import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('homepage_carousel_images')
export class HomepageCarouselImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  altText?: string;

  @Column({ type: 'text', nullable: true })
  linkUrl?: string;

  @Column({ type: 'enum', enum: ['image', 'video'], default: 'image', nullable: false })
  mediaType: 'image' | 'video';

  @Index('idx_homepage_carousel_order')
  @Column({ type: 'int', default: 0 })
  order: number;

  @Index('idx_homepage_carousel_is_active')
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


