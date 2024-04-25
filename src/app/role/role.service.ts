import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    ) {}

  async create(data): Promise<Role[]> {
    return await this.roleRepository.save(data);
  }

  async get(id): Promise<Role[]> {
    return await this.roleRepository.find({ where: { id } });
  }

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}
