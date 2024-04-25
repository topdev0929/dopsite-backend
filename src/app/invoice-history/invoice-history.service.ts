import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { InvoiceHistory } from "./invoice-history.entity";
import { sendEmail } from "../../services/EmailService";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class InvoiceHistoryService {
  constructor(
    @Inject("INVOICE_HISOTRY_REPOSITORY")
    private readonly invoiceHistoryRepository: Repository<InvoiceHistory>
  ) {}

  async getInvoiceHistoryById(id) {
    return this.invoiceHistoryRepository.findOneBy({ id });
  }

  async getAllInvoicesByCompany(company_id) {
    const invoice_histories = await this.invoiceHistoryRepository.find({ where:{ company_id : company_id }});
    return invoice_histories
  }

  async getAllInvoicesByProject(project_id) {
    const invoice_histories = await this.invoiceHistoryRepository.findOneBy({project_id});
    return invoice_histories
  }

  async resendInvoice(project_id) {
    const invoice_history = await this.invoiceHistoryRepository.findOneBy({project_id});
    if(invoice_history) {
      let params = {
        sendEmail: invoice_history.customer_email,
        subject: `You have received a new Invoice from ${invoice_history.company_name}`,
        html: `
          <div>
            Thank you for your business, please click on the Invoice button below to view or save your invoice.
          </div>
          <div>
            <p style="text-align: center; margin-top: 20px;">
              <a href=${process.env.SERVER_URL}/stripe/${invoice_history.id} target="_blank" style="background: tomato;width:65%; margin-right: 20px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Pay Now</a>
              <a href=${process.env.SERVER_URL}/print-invoice/${invoice_history.id} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 10px 20px; border-radius: 2px; border-radius: 5px; text-transform: uppercase;text-align: center;">Download PDF</a>
            </p>
          </div>
        `,
      };
      await sendEmail(params);
      if (invoice_history.company_copy_invoices_user !== "N/A") {
        params.sendEmail = invoice_history.company_copy_invoices_user;
        await sendEmail(params);
      }
      return {success: true, message: 'email was re-sent again!'}
    } else {
      return {success: false, message: 'You have already sent the invoice to the customer!'}
    }
  }
  
}
