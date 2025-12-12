import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  excerpt: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false, default: 'Équipe Exped360' })
  author: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  featuredImage: string | null;

  @Column({ type: 'varchar', nullable: true })
  featuredImagePublicId: string | null;

  @Column({
    type: 'enum',
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @Column({ type: 'date', nullable: false })
  publishedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  seoTitle: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription: string | null;

  @Column({ type: 'simple-array', nullable: true })
  seoKeywords: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  canonicalUrl: string | null;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
