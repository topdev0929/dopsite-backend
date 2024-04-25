import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity';

@Injectable()
export class MachineService {
  constructor(
    @Inject('MACHINE_REPOSITORY')
    private readonly machineRepository: Repository<Machine>,
    ) {}

  async create(data): Promise<Machine[]> {
    data.cause_failure = JSON.stringify(data.cause_failure);
    return await this.machineRepository.save(data);
  }

  async get(id): Promise<Machine[]> {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t3.updated_at AS customer_updated_at, t3.created_at AS customer_created_at, t2.city AS project_city, t2.state AS project_state, t2.street AS project_street, t2.zip AS project_zip
                FROM machine AS t1
                LEFT JOIN project AS t2 ON t1.project_id=t2.id
                LEFT JOIN customer AS t3 ON t2.customer_id=t3.id WHERE t1.id='${id}' ORDER BY t1.created_at DESC`
    return await this.machineRepository.query(sql);
  }

  async getDop(id): Promise<Machine[]> {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t3.updated_at AS customer_updated_at, t3.created_at AS customer_created_at, t4.city AS city, t4.state AS state, t4.street AS street, t4.zip AS zip, t4.logo AS logo, t5.signature AS signature,
                t2.city AS project_city, t2.state AS project_state, t2.street AS project_street, t2.zip AS project_zip
                FROM machine AS t1
                LEFT JOIN project AS t2 ON t1.project_id=t2.id
                LEFT JOIN customer AS t3 ON t2.customer_id=t3.id
                LEFT JOIN user AS t5 ON t1.machine_creator=t5.id
                LEFT JOIN company AS t4 ON t3.company_id=t4.id WHERE t1.id='${id}'`
    return await this.machineRepository.query(sql);
  }

  async getDops(project_id): Promise<Machine[]> {
    const sql = `SELECT *, t1.id AS id, t1.updated_at AS updated_at, t1.created_at AS created_at, t3.updated_at AS customer_updated_at, t3.created_at AS customer_created_at, t4.city AS city, t4.state AS state, t4.street AS street, t4.zip AS zip, t4.logo AS logo, t5.signature AS signature,
                t2.city AS project_city, t2.state AS project_state, t2.street AS project_street, t2.zip AS project_zip
                FROM machine AS t1
                LEFT JOIN project AS t2 ON t1.project_id=t2.id
                LEFT JOIN customer AS t3 ON t2.customer_id=t3.id
                LEFT JOIN user AS t5 ON t1.machine_creator=t5.id
                LEFT JOIN company AS t4 ON t3.company_id=t4.id WHERE t1.project_id='${project_id}' ORDER BY t1.created_at DESC`
    return await this.machineRepository.query(sql);
  }

  async getDopCertificateNum(company_id) {
    const sql = `SELECT MAX(certificate_id) AS num
                FROM machine AS t1
                LEFT JOIN project AS t2 ON t1.project_id=t2.id
                LEFT JOIN customer AS t3 ON t2.customer_id=t3.id WHERE t3.company_id='${company_id}'`
    return await this.machineRepository.query(sql);
  }
  async getAll(project_id): Promise<Machine[]> {
    return await this.machineRepository.find({ where: { project_id } });
  }

  async update(id, data) {
    delete data.id
    data.cause_failure = JSON.stringify(data.cause_failure);
    return await this.machineRepository.update(id, data);
  }

  async remove(id) {
    return await this.machineRepository.delete(id);
  }
  
}
