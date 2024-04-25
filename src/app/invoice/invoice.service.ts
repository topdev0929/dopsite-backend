import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity";
import { Project } from "../project/project.entity";
import { Report } from '../report/report.entity';
import { InvoiceHistory } from "../invoice-history/invoice-history.entity";
import { ReportHistory } from "../report-history/report-history.entity";
import { sendEmail } from "../../services/EmailService";
import { ProjectService } from "../project/project.service";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class InvoiceService {
  @Inject(ProjectService)
  private readonly projectService: ProjectService;

  constructor(
    @Inject("INVOICE_REPOSITORY")
    private readonly invoiceRepository: Repository<Invoice>,
    @Inject("PROJECT_REPOSITORY")
    private readonly projectRepository: Repository<Project>,
    @Inject("INVOICE_HISOTRY_REPOSITORY")
    private readonly invoiceHistoryRepository: Repository<InvoiceHistory>,
    @Inject("REPORT_REPOSITORY")
    private readonly reportRepository: Repository<Report>,
    @Inject("REPORT_HISTORY_REPOSITORY")
    private readonly reportHistoryRepository: Repository<ReportHistory>
  ) {}

  async getAccount() {
    const account = await stripe.accounts.create({ type: "express" });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      // refresh_url: `http://localhost:3000/settings/company/error`,
      // return_url: `http://localhost:3000/settings/company/${account['id']}`,

      refresh_url: `${process.env.SERVER_URL}/settings/company/error`,
      return_url: `${process.env.SERVER_URL}/settings/company/${account.id}`,
      type: "account_onboarding",
    });
    return accountLink;
  }

  async pay(id) {
    // const sql = `SELECT t4.bank_account AS account, t1.amount AS amount FROM invoice AS t1  LEFT JOIN project AS t2 ON (t1.project_id=t2.id) LEFT JOIN customer AS t3 ON (t3.id = t2.customer_id) LEFT JOIN company AS t4 ON (t4.id = t3.company_id) WHERE t1.id = '${id}'`
    // const data = await this.invoiceRepository.query(sql);
    // const transfer = await stripe.transfers.create({
    //   amount: data[0].amount,
    //   currency: "usd",
    //   source_transaction: 'pi_3LrqwBFhBSxF9fu614TB6CPN',
    //   destination: data[0].account,
    // });
    // return transfer;
  }

  async create(data): Promise<Invoice[]> {
    return await this.invoiceRepository.save(data);
  }

  async get(id): Promise<Invoice[]> {
    const sql = `SELECT t4.fee_status AS fee_status, t1.amount AS amount FROM invoice AS t1  LEFT JOIN project AS t2 ON (t1.project_id=t2.id) LEFT JOIN customer AS t3 ON (t3.id = t2.customer_id) LEFT JOIN company AS t4 ON (t4.id = t3.company_id) WHERE t1.id = '${id}'`;
    return await this.invoiceRepository.query(sql);
  }

  async payed(data) {
    const id = data.id;
    delete data.id;
    if (data.fee_status) {
      data.fee_status = true;
    } else {
      data.fee_status = false;
    }
    return await this.invoiceRepository.update(id, { status: true, ...data });
  }

  async paymentSecret(data) {
    const sql = `SELECT t4.fee_status AS fee_status, t4.bank_account AS account, t1.amount AS amount FROM invoice AS t1  LEFT JOIN project AS t2 ON (t1.project_id=t2.id) LEFT JOIN customer AS t3 ON (t3.id = t2.customer_id) LEFT JOIN company AS t4 ON (t4.id = t3.company_id) WHERE t1.id = '${data.id}'`;
    const invoiceRow = await this.invoiceRepository.query(sql);

    try {
      let pay_amount;
      let fee_amount;
      if (invoiceRow[0].fee_status) {
        pay_amount =
          Number(
            Number((Number(invoiceRow[0].amount) + 0.3) / (1 - 0.035)).toFixed(
              1
            )
          ) * 100;
      } else {
        pay_amount = invoiceRow[0].amount * 100;
      }
      fee_amount =
        Number(
          Number(
            (Number(invoiceRow[0].amount) + 0.3) / (1 - 0.035) -
              Number(invoiceRow[0].amount)
          ).toFixed(1)
        ) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        // Always decide how much to charge on the server side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.
        amount: pay_amount, // Stripe uses amount in cents
        currency: "usd",
        application_fee_amount: fee_amount,
        payment_method_types: ["card"],
        receipt_email: data.email, // customer email, used for invoices and confirmations
        transfer_data: {
          destination: invoiceRow[0].account,
        },
      });

      return { client_secret: paymentIntent.client_secret };
    } catch (error) {
      return { statusCode: 500, message: error.message };
    }
  }

  async getByProject(project_id) {
    return await this.invoiceRepository.findOne({ where: { project_id } });
  }

  async getInvoiceNum(company_id) {
    const sql = `SELECT MAX(t1.invoice_id) AS num
                FROM invoice AS t1
                LEFT JOIN project AS t2 ON (t1.project_id=t2.id)
                LEFT JOIN customer AS t3 ON (t2.customer_id=t3.id)
                WHERE t3.company_id='${company_id}'`;
    return await this.invoiceRepository.query(sql);
  }

  async getAll(company_id, data) {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t1.status AS status
                FROM invoice AS t1
                LEFT JOIN project AS t2 ON (t1.project_id=t2.id)
                LEFT JOIN customer AS t3 ON (t2.customer_id=t3.id)
                WHERE t3.company_id='${company_id}' `;
    const reSql =
      sql +
      "ORDER BY t1.created_at DESC LIMIT " +
      (data.page - 1) * 10 +
      ", " +
      data.limit;
    const lists = await this.invoiceRepository.query(reSql);
    const total_count = await this.invoiceRepository.query(sql);
    return { lists, total_count: total_count.length };
  }

  async getInvoiceByCompany(company_id, data) {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t1.status AS status
                FROM invoice AS t1
                LEFT JOIN project AS t2 ON (t1.project_id=t2.id)
                LEFT JOIN customer AS t3 ON (t2.customer_id=t3.id)
                WHERE t3.company_id='${company_id}' AND t1.status=true `;
    const reSql =
      sql +
      "ORDER BY t1.paid_date DESC LIMIT " +
      (data.page - 1) * 10 +
      ", " +
      data.limit;
    const lists = await this.invoiceRepository.query(reSql);
    const total_count = await this.invoiceRepository.query(sql);
    return { lists, total_count: total_count.length };
  }

  async update(id, data) {
    return await this.invoiceRepository.update(id, data);
  }

  async remove(id) {
    return await this.invoiceRepository.delete(id);
  }

  async sendInvoice(data) {
    let logoHtml = "";
    if (data?.companyInfo?.logo) {
      logoHtml = `<img src="https://s3.amazonaws.com/${process.env.BUCKET_NAME}/${data?.companyInfo?.logo}" alt='' height="70px" />`;
    }

    let invoiceRow, invoice_history_row;
    
    if (!data.resend) {
      const reData = {
        project_id: data.editData.project_id,
        invoice_date: new Date(data.editData.invoice_date),
        invoice_id: data.editData.invoice_id,
        sender_user_id: data.editData.sender_user_id,
        initial_rate: data.companyInfo.initial_rate,
        additional_rate: data.companyInfo.additional_rate,
        amount:
          data.discount !== 0
            ? data.subtotal - data.subtotal * (data.discount / 100)
            : data.subtotal,
        discount: data.discount,
      };
      const sql = `UPDATE project SET status=true WHERE id='${data.editData.project_id}'`;
      await this.invoiceRepository.query(sql);
      
      invoiceRow = await this.invoiceRepository.save(reData);

      const invoiceHistoryData = {
        company_id: data.company_id,
        invoice_id: data.editData.invoice_id,
        invoice_date: new Date(data.editData.invoice_date),
        project_id: data.editData.project_id,
        project_name: data.editData.project_name,
        project_city: data.editData.project_city,
        project_state: data.editData.project_state,
        project_street: data.editData.project_state,
        project_zip: data.editData.project_zip,
        reference_id: data.editData.reference_id,
        sender_user_id: data.editData.sender_user_id,
        ses_project_id: data.editData.ses_project_id,
        state: data.editData.state,
        street: data.editData.street,
        terms: data.editData.terms,
        zip: data.editData.zip,
        extra_test_num: data.editData.extra_test_num,
        customer_name: data.editData.customer_name,
        customer_id: data.editData.customer_id,
        customer_email: data.editData.customer_email,
        city: data.editData.city,
        subtotal: data.subtotal,
        company_additional_rate: data.companyInfo.additional_rate,
        company_bank_account: data.companyInfo.bank_account,
        company_city: data.companyInfo.city,
        company_name: data.companyInfo.company_name,
        company_copy_invoices_user: data.companyInfo.copy_invoices_user,
        company_copy_reports_user: data.companyInfo.copy_reports_user,
        create_user_id: data.companyInfo.create_user_id,
        company_discount: data.companyInfo.discount,
        company_dop_certificate_start: data.companyInfo.dop_certificate_start,
        company_initial_rate: data.companyInfo.initial_rate,
        company_invoice_start: data.companyInfo.invoice_start,
        company_invoice_start_prefix: data.companyInfo.invoice_start_prefix,
        company_logo: data.companyInfo.logo,
        company_phone: data.companyInfo.phone,
        company_state: data.companyInfo.state,
        company_status: data.companyInfo.status,
        company_street: data.companyInfo.street,
        company_subscription_level: data.companyInfo.subscription_level || null,
        company_website: data.companyInfo.website,
        company_zip: data.companyInfo.zip,
        amount:
          data.discount !== 0
            ? data.subtotal - data.subtotal * (data.discount / 100)
            : data.subtotal,
        discount: data.discount,
      };

      invoice_history_row = await this.invoiceHistoryRepository.save(
        invoiceHistoryData
      );

      if(invoice_history_row) {
        let params = {
          sendEmail: invoice_history_row.customer_email,
          subject: `You have received a new Invoice from ${invoice_history_row.company_name}`,
          html: `
            <div>
              Thank you for your business, please click on the Invoice button below to view or save your invoice.
            </div>
            <div>
              <p style="text-align: center; margin-top: 20px;">
                <a href=${process.env.SERVER_URL}/stripe/${invoice_history_row.id} target="_blank" style="background: tomato;width:65%; margin-right: 20px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Pay Now</a>
                <a href=${process.env.SERVER_URL}/print-invoice/${invoice_history_row.id} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Download PDF</a>
              </p>
            </div>
          `,
        };
  
        await sendEmail(params);
        if (invoice_history_row.company_copy_invoices_user !== "N/A") {
          params.sendEmail = invoice_history_row.company_copy_invoices_user;
          await sendEmail(params);
        }
      } else {
        return {success: false, message: 'You have already sent the invoice to the customer!'}
      }


      //manage the report data

      const reportReData = {
        project_id: data.editData.project_id,
        report_date: new Date(data.editData.report_date),
        pass_num: data.tableData.filter((res) => res.equipment_test === true)
          .length,
        fail_num: data.tableData.filter((res) => res.equipment_test === false)
          .length,
        reporter_user_id: data.editData.reporter_user_id,
      };
  
      const report_history_data = {
        userId: data.userId,
        customer_email: data.editData.customer_email,
        customer_name: data.editData.customer_name,
        project_name: data.editData.project_name,
        customer_id: data.editData.customer_id,
        ses_project_id: data.editData.ses_project_id,
        reference_id: data.editData.reference_id,
        project_city: data.editData.project_city,
        project_state: data.editData.project_state,
        project_street: data.editData.project_street,
        project_zip: data.editData.project_zip,
        project_id: data.editData.project_id,
        report_date: new Date(data.editData.report_date),
        city: data.editData.city,
        state: data.editData.state,
        street: data.editData.street,
        zip: data.editData.zip,
        tested_at: new Date(data.editData.tested_at),
        reporter_user_id: data.editData.sender_user_id,
        technician_name: data.currentUser.firstname + ' ' + data.currentUser.lastname,
        pass_num: data.tableData.filter((res) => res.equipment_test === true)
          .length,
        fail_num: data.tableData.filter((res) => res.equipment_test === false)
          .length,
  
        inspector_firstname: data.currentUser.firstname,
        inspector_lastname: data.currentUser.firstname,
        inspector_signature_level: data.currentUser.signature_level,
        inspector_signature: data.currentUser.signature,
        inspector_signature_logo: data.currentUser.signature_logo,
  
        company_id: data.companyInfo.id,
        company_bank_account: data.companyInfo.bank_account,
        company_name: data.companyInfo.company_name,
        company_logo: data.companyInfo.logo,
        company_phone: data.companyInfo.phone,
        company_website: data.companyInfo.website,
        company_street: data.companyInfo.street,
        company_city: data.companyInfo.city,
        company_state: data.companyInfo.state,
        company_zip: data.companyInfo.zip,
        company_initial_rate: data.companyInfo.initial_rate,
  
        company_additional_rate: data.companyInfo.additional_rate,
        company_dop_certificate_start: data.companyInfo.dop_certificate_start,
        company_invoice_start: data.companyInfo.invoice_start,
        company_invoice_start_prefix: data.companyInfo.invoice_start_prefix,
        company_discount: data.companyInfo.discount,
        company_copy_reports_user: data.companyInfo.copy_reports_user,
        company_copy_invoices_user: data.companyInfo.copy_invoices_user,
        create_user_id: data.companyInfo.create_user_id,
        fee_status: data.companyInfo.fee_status,
        mashine_info: JSON.stringify(data.tableData),
      };

      const report_history_row = await this.reportHistoryRepository.save(report_history_data)

      if(report_history_row) {
        const reportParams = {
          sendEmail: data.editData.customer_email,
          subject: "Report",
          html: `
            <div>
              Thank you for your business, please click the button below to download report file.
            </div>
            <p style="text-align: center;margin-top: 30px;"><a href=${process.env.SERVER_URL}/print-reports/${report_history_row.id} target="_blank" style="background:#75AC2A;display: inline-block; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; text-align: center;margin: auto;">Download PDF</a>
          </div>
          `,
        };
  
        await sendEmail(reportParams);
    
        if (data.companyInfo.copy_reports_user !== "N/A") {
          reportParams.sendEmail = data.companyInfo.copy_reports_user;
          await sendEmail(reportParams);
        }
      } 

      const reportData = await this.reportRepository.find({
        where: { project_id: reportReData.project_id },
      });
  
      if (reportData.length > 0) {
        return await this.reportRepository.update(reportData[0].id, reportReData);
      } else {
        return await this.reportRepository.save(reportReData);
      }
    } else {
      // const reData = {
      //   amount:
      //     data.discount !== 0
      //       ? data.subtotal - data.subtotal * (data.discount / 100)
      //       : data.subtotal,
      //   discount: data.discount,
      // };
      // const sql1 = `UPDATE invoice SET amount=${reData.amount} WHERE project_id='${data.project_id}'`;
      // await this.invoiceRepository.query(sql1);
      // const sql2 = `SELECT * FROM invoice_history WHERE project_id='${data.project_id}'`;
      // invoice_history_row = await this.invoiceHistoryRepository.query(sql2);
      // invoice_history_row = invoice_history_row[0];

      // let params = {
      //   sendEmail: invoice_history_row.customer_email,
      //   subject: `You have received a new Invoice from ${invoice_history_row.company_name}`,
      //   html: `
      //     <div>
      //       Thank you for your business, please click on the Invoice button below to view or save your invoice.
      //     </div>
      //     <div>
      //       <p style="text-align: center; margin-top: 20px;">
      //         <a href=${process.env.SERVER_URL}/stripe/${invoice_history_row.id} target="_blank" style="background: tomato;width:65%; margin-right: 20px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Pay Now</a>
      //         <a href=${process.env.SERVER_URL}/print-invoice/${invoice_history_row.id} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Download PDF</a>
      //       </p>
      //     </div>
      //   `,
      // };

      // await sendEmail(params);

      // if (invoice_history_row.company_copy_invoices_user !== "N/A") {
      //   params.sendEmail = invoice_history_row.company_copy_invoices_user;
      //   await sendEmail(params);
      // }
      // return true;
      return false
    }
  }

  async createSubscription(createSubscriptionRequest) {
    // create a stripe customer
    const customer = await stripe.customers.create({
      name: createSubscriptionRequest.name,
      email: createSubscriptionRequest.email,
      payment_method: createSubscriptionRequest.paymentMethod,
      invoice_settings: {
        default_payment_method: createSubscriptionRequest.paymentMethod,
      },
    });

    // get suscription price
    const prices = await stripe.prices.list({
      lookup_keys: ["test"],
    });

    // create a stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: prices.data[0].id }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // return the client secret and subscription id
    return {
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    };
  }

  async cancelSubscription(subscriptionId) {
    return await stripe.subscriptions.del(subscriptionId);
  }
}
