import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Double } from 'typeorm';

@Entity()
export class InvoiceHistory  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: null })
  company_id: string;

  @Column({ default: 0 })
  invoice_id: number;

  @Column({ default: null })
  invoice_date: Date;

  @Column({ default: null })
  project_id: string;

  @Column({ default: null })
  project_name: string;

  @Column({ default: null })
  project_city: string;

  @Column({ default: null })
  project_state: string;

  @Column({ default: null })
  project_street: string;

  @Column({ default: null })
  project_zip: string;

  @Column({ default: null })
  reference_id: string;

  @Column({ default: 0 })
  sender_user_id: number;

  @Column({ default: null })
  ses_project_id: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  street: string;

  @Column({ default: null })
  terms: string;

  @Column({ default: null })
  zip: string;

  @Column({ default: 0 })
  extra_test_num: number;

  @Column({ default: null })
  discount: string;

  @Column({ default: null })
  amount: string;

  @Column({ default: null })
  customer_name: string;

  @Column({ default: null })
  customer_id: string;

  @Column({ default: null })
  customer_email: string;

  @Column({ default: null })
  city: string;

  @Column({ default: 0 })
  subtotal: number;

  @Column({ default: 0 })
  company_additional_rate: number;

  @Column({ default: null })
  company_bank_account: string;

  @Column({ default: null })
  company_city: string;

  @Column({ default: null })
  company_name: string;

  @Column({ default: null })
  company_copy_invoices_user: string;

  @Column({ default: null })
  company_copy_reports_user: string;

  @Column({ default: null })
  create_user_id: number;

  @Column({ length: 500, default: 'N/A' })
  company_discount: string;

  @Column({ default: 0 })
  company_dop_certificate_start: number;

  @Column({ default: false})
  company_fee_status: boolean;

  @Column({ default: null })
  paid_date: Date;

  @Column({ length: 500, default: null })
  paider_name: string;

  @Column({ length: 500, default: null })
  paider_email: string;

  @Column({ default: 0 })
  company_initial_rate: number;

  @Column({ default: 0 })
  company_invoice_start: number;

  @Column({ default: null })
  company_invoice_start_prefix: string;

  @Column({ default: null })
  company_logo: string;

  @Column({ default: null })
  company_phone: string;

  @Column({ default: null })
  company_state: string;

  @Column({ default: null })
  company_street: string;

  @Column({ default: null })
  company_subscription_level: string;

  @Column({ default: null })
  company_website: string;

  @Column({ default: null })
  company_zip: string;

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
