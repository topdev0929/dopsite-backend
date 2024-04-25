import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Company  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ length: 500, default: null })
  bank_account: string;

  @Column({ length: 500, default: null })
  company_name: string;

  @Column({ length: 500, default: null })
  logo: string;

  @Column({ length: 500, default: null })
  phone: string;

  @Column({ length: 500, default: null })
  website: string;

  @Column({ length: 500, default: null })
  street: string;

  @Column({ length: 500, default: null })
  city: string;

  @Column({ length: 500, default: null })
  state: string;

  @Column({ length: 500, default: null })
  zip: string;

  @Column({ default: 0 })
  initial_rate: number;

  @Column({ default: 0 })
  additional_rate: number;

  @Column({ default: 0 })
  dop_certificate_start: number;

  @Column({ default: 0 })
  invoice_start: number;

  @Column({ length: 500, default: null })
  invoice_start_prefix: string;

  @Column({ length: 500, default: null })
  discount: string;

  @Column({ length: 500, default: 'N/A' })
  copy_reports_user: string;

  @Column({ length: 500, default: 'N/A' })
  copy_invoices_user: string;

  @Column({ length: 500, default: null })
  session_id: string;

  @Column({ length: 50, default: null })
  subscription_level: string;

  @Column({ default: null })
  create_user_id: number;

  @Column({ default: false })
  status: boolean;

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
