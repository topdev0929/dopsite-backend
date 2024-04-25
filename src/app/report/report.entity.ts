import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Report  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  project_id: string;

  @Column({ default: null })
  report_date: Date;

  @Column({ default: null })
  pass_num: number;

  @Column({ default: null })
  fail_num: number;

  @Column({ default: null })
  reporter_user_id: number;

  @Column({ default: false })
  update_status: boolean;

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
