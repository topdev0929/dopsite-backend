import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Customer  {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ length: 500, default: null })
  customer_name: string;

  @Column({ length: 500, default: null })
  customer_email: string;

  @Column({ length: 500, default: null })
  street: string;

  @Column({ length: 500, default: null })
  city: string;

  @Column({ length: 500, default: null })
  state: string;

  @Column({ length: 500, default: null })
  zip: string;

  @Column({ length: 500, default: null })
  terms: string;

  @Column({ length: 500, default: null })
  discount: string;

  @Column({ default: null })
  company_id: string;

  @Column({ default: null })
  creator: number;

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
