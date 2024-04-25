import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { ReportHistory } from "./report-history.entity";
import { sendEmail } from "../../services/EmailService";
require("dotenv").config();

@Injectable()
export class ReportHistoryService {
  constructor(
    @Inject("REPORT_HISTORY_REPOSITORY")
    private readonly reportHistoryRepository: Repository<ReportHistory>
  ) {}

  async getAllReportsByCompany(company_id) {
    const report_histories = await this.reportHistoryRepository.find({where: {company_id: company_id}});
    return report_histories
  }

  async getReportHistoryByProject(project_id) {
    const report_history = await this.reportHistoryRepository.findOneBy({project_id});
    return report_history
  }

  async getReportHistoryById(id) {
    const report_history = await this.reportHistoryRepository.findOneBy({id});
    return report_history
  }

  async resendReport(data) {
    const report_history = await this.reportHistoryRepository.findOne({where: {project_id: data.projectId}});
    if(report_history) {
      const reportParams = {
        sendEmail: report_history.customer_email,
        subject: "Report",
        html: `
          <div>
            Thank you for your business, please click the button below to download report file.
          </div>
          <p style="text-align: center;margin-top: 30px;"><a href=${process.env.SERVER_URL}/print-reports/${report_history.id} target="_blank" style="background:#75AC2A;display: inline-block; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; text-align: center;margin: auto;">Download PDF</a>
        </div>
        `,
      };
      await sendEmail(reportParams);
      if (report_history.company_copy_reports_user !== "N/A") {
        reportParams.sendEmail = report_history.company_copy_reports_user;
        await sendEmail(reportParams);
      }
      return {success: true, message: 'email was sent successfully!'}
    } else {
      return {success: false, message: 'we can not send email for this report again!'}
    }
  }

}
