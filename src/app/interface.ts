export interface customerData {
  customer_name?: string,
  customer_email?: string,
  street?: string,
  city?: string,
  state?: string,
  zip?: string
}

export interface projectData {
  ses_project_id?: string,
  customer_id?: string,
  reference_id?: string,
  status?: boolean,
  completion_date?: Date,
  city?:string,
  state?:string,
  zip?:string,
  street?:string
  // report?: string,
}

export interface machineData {
  project_id?: number,
  certificate_id?: string,
  equipment_type?: string,
  make?: string,
  model?: string,
  serial_id?: string,
  equipment_test?: boolean
}

export interface reportData {
  project_id?: number,
  report_date?: Date,
  pass_num?: number,
  fail_num?: number,
  reporter_user_id?: number,
  update_status?: boolean
}

export interface invoiceData {
  invoice_id?: string,
  invoice_date?: Date,
  project_id?: number,
  sender_user_id?: number,
  status?: boolean,
  update_status?: boolean
}

export interface companyData {
  company_name?: string,
  logo?: string,
  phone?: string,
  website?: string,
  street?: string,
  city?: string,
  state?: string,
  zip?: string,
  discount?: string,
  create_user_id?: number,
  initial_rate?: number,
  additional_rate?: number,
  create_user_email?: string,
  status?: boolean,
  session_id?:string,
  dop_certificate_start?: number,
  invoice_start?: number,
  subscription_level?: string,
  copy_reports_user?: string,
  copy_invoices_user?: string,
  bank_account?: string,
  invoice_start_prefix?: string
}

export interface userData {
  id?: number,
  email?: string,
  firstname?: string,
  lastname?: string,
  password?: string,
  role_id?: number,
  company_id?: string,
  company_name?: string,
  token?:string,
  logo?: string
}