import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { sendEmail } from '../../services/EmailService'

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_REPOSITORY')
    private readonly companyRepository: Repository<Company>,
    ) {}

  async create(data) {
    const res = await this.companyRepository.find({ where: { create_user_id: data.create_user_id } });
    delete data.create_user_email
    if (res && res.length) {
      return await this.companyRepository.update({create_user_id: data.create_user_id}, data);
    }
    return await this.companyRepository.save(data);
  }

  async check(data) {
    return await this.companyRepository.find({ where: { create_user_id: data.create_user_id } });
  }

  async get(id): Promise<Company[]> {
    return await this.companyRepository.find({ where: { id } });
  }

  async getAll(): Promise<Company[]> {
    const sql = `SELECT *, t1.id AS ID FROM company AS t1 LEFT JOIN user AS t2 ON (t1.create_user_id = t2.id) ORDER BY t1.created_at DESC`
    return await this.companyRepository.query(sql);
  }

  async getApprove(): Promise<Company[]> {
    return await this.companyRepository.find({ where: { status: true } });
  }

  async update(id, data) {
    const reData = data
    delete reData.id
    if (reData.discount) {
      reData.discount = reData.discount.toString()
    }
    await this.companyRepository.update(id, reData);
  }

  async updateCompany(id, data) {
    let params
    if (data.status) {
      params = {
        sendEmail: data.email ,
        subject: 'doptestnetwork.com',
        html: `<p>Dear ${data.name}</p>
              <p>Congradulations! Approved your requested new company account successfully.</p>
              <p>${data.site_admin_name} (${data.site_admin_email})</p>`
      }
      // import company_id in applicant user table
        const sql = `UPDATE user SET company_id='${id}', role_id=2 WHERE email='${data.email}'`
        await this.companyRepository.query(sql);
      // -----------------------------------------
    } else {
      params = {
        sendEmail: data.email ,
        subject: 'doptestnetwork.com',
        html: `<p>Dear ${data.name}</p>
              <p>Opps! Rejected your company account.</p>
              <p>${data.site_admin_name}</p>
              <p>Please contact to ${data.site_admin_email}</p>`
      }
    }
    await sendEmail(params)
    const reData = data
    delete reData.site_admin_email
    delete reData.site_admin_name
    delete reData.email
    delete reData.name
    return await this.companyRepository.update(id, data);
  }

  async remove(id, data) {
    const params = {
      sendEmail: data.email ,
      subject: 'doptestnetwork.com',
      html: `<p>Dear ${data.name}</p>
            <p>Opps! Deleted your company account.</p>
            <p>${data.site_admin_name}</p>
            <p>Please contact to ${data.site_admin_email}</p>`
    }
    await sendEmail(params)
    return await this.companyRepository.delete(id);
  }

  async getStuffs(company_id, data) {
    const sql =`SELECT * FROM user WHERE company_id = '${company_id}'`
    const reSql = sql + ' ORDER BY created_at DESC LIMIT ' + ((data.page - 1) * 10) + ', ' + data.limit
    const lists = await this.companyRepository.query(reSql);
    const total_count = await this.companyRepository.query(sql);
    return { lists, total_count: total_count.length }
  }

  async setBankAccount(company_id, bank_account) {
    const sql = `UPDATE company SET bank_account='${bank_account}' WHERE id = '${company_id}'`
    return await this.companyRepository.query(sql);
  }

  async getTransactions(data) {
    let param;
    if (data.start) {
      if (data.direction == 'next') {
        param = { limit: data.limit, starting_after: data.start, type: data.type }
      } else {
        param = { limit: data.limit, ending_before: data.start, type:data.type }
      }
    } else {
      param = { limit: data.limit, type:data.type }
    }
    if (!data.type) {
      delete param.type
    }
    let transactions =  await stripe.balanceTransactions.list(param);
    transactions = transactions.data
    const arrays = []
    for (const i in transactions) {
      let res;
      if (transactions[i].type === 'charge') {
        res = await stripe.charges.retrieve(transactions[i].source)
        arrays[i] = Object.assign(transactions[i], { custom_description: res.billing_details })
      } else if (transactions[i].type === 'transfer') {
        res = await stripe.transfers.retrieve(transactions[i].source)
        arrays[i] = Object.assign(transactions[i], { custom_description: res.destination })
      } else {
        arrays[i] = transactions[i]
      }
    }
    return arrays
  }

  async getTransactionsByCompany(data) {
    let param;
    if (data.start) {
      if (data.direction == 'next') {
        param = { limit: data.limit, starting_after: data.start, type: data.type }
      } else {
        param = { limit: data.limit, ending_before: data.start, type:data.type }
      }
    } else {
      param = { limit: data.limit, type:data.type }
    }
    if (!data.type) {
      delete param.type
    }
    let transactions =  await stripe.balanceTransactions.list(param);
    transactions = transactions.data
    const arrays = []
    for (const i in transactions) {
      let res;
      if (transactions[i].type === 'charge') {
        res = await stripe.charges.retrieve(transactions[i].source)
        arrays[i] = Object.assign(transactions[i], { custom_description: res.billing_details })
      } else if (transactions[i].type === 'transfer') {
        res = await stripe.transfers.retrieve(transactions[i].source)
        arrays[i] = Object.assign(transactions[i], { custom_description: res.destination })
      } else {
        arrays[i] = transactions[i]
      }
    }
    return arrays
  }

  async getRootAmount(data) {
    const amount = await stripe.balance.retrieve();
    const params = { expand: ['data.source'], include: ['total_count'], limit: 0, type: data.type }
    if (!data.type) {
      delete params.type
    }

    const total_count = await stripe.balanceTransactions.list(params);
    return { amount, total_count }
  }

  async getCompanyBalance(data) {
    return await stripe.balance.retrieve({stripeAccount: data});
  }
  async getTransactionInfo(data) {
    let res;
    if (data.type === 'charge') {
      res = await stripe.charges.retrieve(data.id)
    } else if (data.type === 'transfer') {
      res = await stripe.transfers.retrieve(data.id)
    }
    return res
  }
}
