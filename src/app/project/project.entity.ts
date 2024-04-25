import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Project  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ length: 500 })
  ses_project_id: string;

  @Column({ default: null })
  customer_id: string;

  @Column({ length: 500, default: null })
  reference_id: string;

  @Column({ default: false })
  status: boolean;

  @Column({ default: null })
  completion_date: Date;

  @Column({ length: 500, default: null })
  report: string;

  @Column({ length: 500, default: null })
  project_name: string;

  @Column({ length: 500, default: null })
  city: string;

  @Column({ length: 500, default: null })
  state: string;

  @Column({ length: 500, default: null })
  zip: string;

  @Column({ length: 500, default: null })
  street: string;

  @Column({ default: null })
  creator: number;

  @UpdateDateColumn({
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @CreateDateColumn({
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
