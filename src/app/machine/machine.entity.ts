import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Machine  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: null })
  project_id: string;

  @Column({ default: null })
  machine_creator: number;

  @Column({ default: 0 })
  certificate_id: number;

  @Column({ length: 500, default: null })
  equipment_type: string;

  @Column({ length: 500, default: null })
  make: string;

  @Column({ length: 500, default: null })
  model: string;

  @Column({ length: 500, default: null })
  serial_id: string;

  @Column({ length: 500, default: null })
  cause_failure: string;

  @Column({ default: true })
  equipment_test: boolean;

  @Column({ default: null })
  date: Date;

  @UpdateDateColumn({
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @CreateDateColumn({
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
