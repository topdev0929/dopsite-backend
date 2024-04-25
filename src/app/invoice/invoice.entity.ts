import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Double } from 'typeorm';

@Entity()
export class Invoice  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: 0 })
  invoice_id: number;

  @Column({ default: null })
  invoice_date: Date;

  @Column({ default: null })
  project_id: string;

  @Column({ default: null })
  sender_user_id: number;

  @Column({ default: false })
  status: boolean;

  @Column({ default: false })
  update_status: boolean;

  @Column({ default: 0 })
  amount: string;

  @Column({ default: 0 })
  initial_rate: number;

  @Column({ default: 0 })
  additional_rate: number;

  @Column({ length: 500, default: 'N/A' })
  discount: string;

  @Column({ default: null })
  paid_date: Date;

  @Column({ length: 500, default: null })
  paider_name: string;

  @Column({ length: 500, default: null })
  paider_email: string;

  @Column({ default: false })
  fee_status: boolean;

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
