
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    private readonly customerRepository: Repository<Customer>,
    ) {}

  async create(data): Promise<Customer[]> {
    return await this.customerRepository.save(data);
  }

  async get(id, company_id): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { id, company_id } });
  }

  async getAll(company_id, data) {
    const sql = `SELECT * FROM customer WHERE company_id='${company_id}' `
    const reSql = sql + 'ORDER BY created_at DESC LIMIT ' + ((data.page - 1) * 10) + ', ' + data.limit
    const lists = await this.customerRepository.query(reSql);
    const total_count = await this.customerRepository.query(sql);
    return { lists, total_count: total_count.length }
  }

  async getAllCompany(company_id) {
    const sql = `SELECT * FROM customer WHERE company_id='${company_id}' `
    return await this.customerRepository.query(sql);
  }

  async update(id, data) {
    return await this.customerRepository.update(id, data);
  }

  async remove(id) {
    const sql1 = `SELECT * FROM project WHERE customer_id='${id}'`
    const project = await this.customerRepository.query(sql1)
    for(const i in project) {
      const sql3 = `DELETE FROM machine WHERE project_id='${project[i]?.id}'`
      await this.customerRepository.query(sql3)
    }
    const sql2 = `DELETE FROM project WHERE customer_id='${id}'`
    await this.customerRepository.query(sql2)
    return await this.customerRepository.delete(id);
  }
}
