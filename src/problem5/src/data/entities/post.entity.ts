import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { default as slugify } from 'slugify';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'creator_id', type: 'integer', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  creator: User;

  @BeforeInsert()
  @BeforeUpdate()
  async generateSlug() {
    const slugTitle = slugify(this.title, { lower: true });
    const existing = await Post.findOne({ where: { slug: slugTitle } });
    this.slug =
      existing && existing.id !== this.id
        ? `${slugTitle}-${Date.now()}`
        : slugTitle;
  }
}
