import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ReportHistory  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  userId: number;

  @Column({ default: null })
  company_id: string;

  @Column({ default: null })
  customer_email: string;

  @Column({ default: null })
  customer_name: string;

  @Column({ default: null })
  project_name: string;

  @Column({ default: null })
  customer_id: string;

  @Column({ default: null })
  ses_project_id: string;

  @Column({ default: null })
  reference_id: string;

  @Column({ default: null })
  project_city: string;
  
  @Column({ default: null })
  project_state: string;

  @Column({ default: null })
  project_street: string;

  @Column({ default: null })
  project_zip: string;

  @Column({ unique: true })
  project_id: string;

  @Column({ default: null })
  report_date: Date;

  @Column({ default: null })
  city: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  street: string;

  @Column({ default: null })
  zip: string;

  @Column({ default: null })
  tested_at: Date;

  @Column({ default: null })
  reporter_user_id: number;

  @Column({ default: null })
  technician_name: string;

  @Column({ default: null })
  pass_num: number;

  @Column({ default: null })
  fail_num: number;

  @Column({ default: null })
  inspector_firstname: string;

  @Column({ default: null })
  inspector_lastname: string;

  @Column({ default: false })
  inspector_signature_level: boolean;

  @Column({ type: 'longtext', default: null })
  inspector_signature: string;

  @Column({ default: null })
  inspector_signature_logo: string;

  @Column({ default: null })
  company_bank_account: string;

  @Column({ default: null })
  company_name: string;

  @Column({ default: null })
  company_logo: string;

  @Column({ default: null })
  company_phone: string;

  @Column({ default: null })
  company_website: string;

  @Column({ default: null })
  company_street: string;

  @Column({ default: null })
  company_city: string;

  @Column({ default: null })
  company_state: string;

  @Column({ default: null })
  company_zip: string;

  @Column({ default: null })
  company_initial_rate: number;

  @Column({ default: null })
  company_additional_rate: number;

  @Column({ default: null })
  company_dop_certificate_start: number;

  @Column({ default: null })
  company_invoice_start: number;

  @Column({ default: null })
  company_invoice_start_prefix: string;

  @Column({ default: null })
  company_discount: string;

  @Column({ default: null })
  company_copy_reports_user: string;

  @Column({ default: null })
  company_copy_invoices_user: string;

  @Column({ default: null })
  create_user_id: number;

  @Column({ default: false })
  fee_status: boolean;

  @Column({ type: 'json',  default: null })
  mashine_info: string;

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
