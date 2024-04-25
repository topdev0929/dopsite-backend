import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: Repository<Project>,
    ) {}

  async create(data): Promise<Project[]> {
    return await this.projectRepository.save(data);
  }

  async get(id): Promise<Project[]> {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t2.updated_at AS customer_updated_at, t2.created_at AS customer_created_at, t1.city AS project_city, t1.state AS project_state, t1.street AS project_street, t1.zip AS project_zip, t1.updated_at AS tested_at
                FROM project AS t1 LEFT JOIN customer AS t2 ON t1.customer_id=t2.id WHERE t1.id='${id}'`
    return await this.projectRepository.query(sql);
  }

  async getAll(company_id, data) {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t2.updated_at AS customer_updated_at, t2.created_at AS customer_created_at, t1.city AS project_city, t1.state AS project_state, t1.street AS project_street, t1.zip AS project_zip
                FROM project AS t1
                LEFT JOIN customer AS t2 ON t1.customer_id=t2.id
                WHERE t2.company_id='${company_id}' `
    const reSql = sql + 'ORDER BY t1.created_at DESC LIMIT ' + ((data.page - 1) * 10) + ', ' + data.limit
    const lists = await this.projectRepository.query(reSql);
    const total_count = await this.projectRepository.query(sql);
    return { lists, total_count: total_count.length }
  }

  async getAlls(customer_id): Promise<Project[]> {
    const sql = `SELECT *, t1.id AS id, t2.id AS invoiceId
                FROM project AS t1
                LEFT JOIN invoice AS t2 ON t1.id=t2.project_id
                WHERE t1.customer_id='${customer_id}' ORDER BY t1.created_at DESC`
    return await this.projectRepository.query(sql);
  }

  async update(id, data) {
    return await this.projectRepository.update(id, data);
  }

  async remove(id) {
    const sql = `DELETE FROM machine WHERE project_id='${id}'`
    await this.projectRepository.query(sql)
    return await this.projectRepository.delete(id)
  }
}
