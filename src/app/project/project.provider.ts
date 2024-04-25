import { Connection, Repository } from 'typeorm';
import { Project } from './project.entity';

export const projectProviders = [
  {
    provide: 'PROJECT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Project),
    inject: ['DATABASE_CONNECTION'],
  },
];
