import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { Report } from "./report.entity";
import { ReportHistory } from "../report-history/report-history.entity";

import { sendEmail } from "../../services/EmailService";
const AWS = require("aws-sdk");
const fs = require("fs").promises;
require("dotenv").config();

@Injectable()
export class ReportService {
  constructor(
    @Inject("REPORT_REPOSITORY")
    private readonly reportRepository: Repository<Report>,

    @Inject("REPORT_HISTORY_REPOSITORY")
    private readonly reportHistoryRepository: Repository<ReportHistory>
  ) {}

  async create(data): Promise<Report[]> {
    return await this.reportRepository.save(data);
  }

  async get(id): Promise<Report[]> {
    return await this.reportRepository.find({ where: { id } });
  }

  async getAll(company_id, data) {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t2.status AS status
                FROM report AS t1
                LEFT JOIN project AS t2 ON (t1.project_id=t2.id)
                LEFT JOIN customer AS t3 ON (t2.customer_id=t3.id)
                WHERE t3.company_id='${company_id}' `;
    const reSql =
      sql +
      "ORDER BY t1.created_at DESC LIMIT " +
      (data.page - 1) * 10 +
      ", " +
      data.limit;
    const lists = await this.reportRepository.query(reSql);
    const total_count = await this.reportRepository.query(sql);
    return { lists, total_count: total_count.length };
  }

  async getAllDahshboard(company_id, data) {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t2.status AS status
                FROM report AS t1
                LEFT JOIN project AS t2 ON (t1.project_id=t2.id)
                LEFT JOIN customer AS t3 ON (t2.customer_id=t3.id)
                LEFT JOIN user AS t4 ON (t1.reporter_user_id=t4.id)
                WHERE t3.company_id='${company_id}' `;
    const reSql =
      sql +
      "ORDER BY t1.created_at DESC LIMIT " +
      (data.page - 1) * 10 +
      ", " +
      data.limit;
    const lists = await this.reportRepository.query(reSql);
    const total_count = await this.reportRepository.query(sql);
    return { lists, total_count: total_count.length };
  }

  async getReportByUser(id) {
    const sql =
      "SELECT * FROM report as t1 LEFT JOIN user as t2 ON (t1.reporter_user_id = t2.id) WHERE t1.project_id='" +
      id +
      "'";
    return await this.reportRepository.query(sql);
  }

  async getUserById(id) {
    const sql = "SELECT * FROM user WHERE id=" + id;
    return await this.reportRepository.query(sql);
  }

  async update(id, data) {
    return await this.reportRepository.update(id, data);
  }

  async remove(id) {
    return await this.reportRepository.delete(id);
  }

  async sendReport(data) {

    if(data.resend) {
      const params = {
        sendEmail: data.customer_email,
        subject: "Report",
        html: `
          <div>
            Thank you for your business, please click the button below to download report file.
          </div>
          <p style="text-align: center;margin-top: 30px;"><a href=${process.env.SERVER_URL}/print-reports/${data.project_id}-${data.userId} target="_blank" style="background:#75AC2A;display: inline-block; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; text-align: center;margin: auto;">Download PDF</a>
        </div>
        `,
      };
      await sendEmail(params);
  
      if (data.copy_reports_user !== "N/A") {
        params.sendEmail = data.copy_reports_user;
        await sendEmail(params);
      }
      return {success: true, message: 'resend successfully'}
    } else {
      const params = {
        sendEmail: data.editData.customer_email,
        subject: "Report",
        html: `
          <div>
            Thank you for your business, please click the button below to download report file.
          </div>
          <p style="text-align: center;margin-top: 30px;"><a href=${process.env.SERVER_URL}/print-reports/${data.editData.project_id}-${data.userId} target="_blank" style="background:#75AC2A;display: inline-block; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; text-align: center;margin: auto;">Download PDF</a>
        </div>
        `,
      };
      await sendEmail(params);
  
      if (data.companyInfo.copy_reports_user !== "N/A") {
        params.sendEmail = data.companyInfo.copy_reports_user;
        await sendEmail(params);
      }
  
      const reData = {
        project_id: data.editData.project_id,
        report_date: new Date(data.editData.report_date),
        pass_num: data.tableData.filter((res) => res.equipment_test === true)
          .length,
        fail_num: data.tableData.filter((res) => res.equipment_test === false)
          .length,
        reporter_user_id: data.editData.reporter_user_id,
      };
  
      const reportHistoryData = await this.reportHistoryRepository.find({
        where: { project_id: reData.project_id },
      });
  
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
        tested_at: data.editData.tested_at,
        reporter_user_id: data.editData.reporter_user_id,
        technician_name: data.editData.technician_name,
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
  
      if (reportHistoryData.length > 0) {
        // await this.reportHistoryRepository.update(reportHistoryData[0].id, reData);
      } else {
        await this.reportHistoryRepository.save(report_history_data)
      }
      const reportData = await this.reportRepository.find({
        where: { project_id: reData.project_id },
      });
  
      if (reportData.length > 0) {
        return await this.reportRepository.update(reportData[0].id, reData);
      } else {
        return await this.reportRepository.save(reData);
      }
    }
  }

  async getS3Image(data) {
    AWS.config.update({
      accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: data.url,
    };
    const s3 = new AWS.S3();
    const { Body } = await s3.getObject(params).promise();
    await fs.writeFile(`public/uploads/${data.url}`, Body);
    return { success: true };
  }

  async getS3ImagesWithSignature(data) {
    AWS.config.update({
      accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3();

    const paramsLogo = {
      Bucket: process.env.BUCKET_NAME,
      Key: data.logo,
    };
    const { Body: Logo } = await s3.getObject(paramsLogo).promise();
    await fs.writeFile(`public/uploads/${data.logo}`, Logo);

    const paramsSignature = {
      Bucket: process.env.BUCKET_NAME,
      Key: data.signature,
    };
    const { Body: Signature } = await s3.getObject(paramsSignature).promise();
    await fs.writeFile(`public/uploads/${data.signature}`, Signature);

    return { success: true };
  }

  async checkReportStatusById(data) {
    const projectId = data.id;
    const sql = `SELECT * FROM report WHERE project_id = '${projectId}'`;
    return await this.reportRepository.query(sql);
  }
}
