import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, default: null })
  firstname: string;

  @Column({ length: 500, default: null })
  lastname: string;

  @Column({ length: 500, default: null })
  email: string;

  @Column({ length: 500, default: null })
  password: string;

  @Column({ type: 'text', default: null })
  signature: string;

  @Column({ length: 500, default: null })
  signature_logo: string;

  @Column({ default: true })
  signature_level: Boolean;

  @Column({ length: 500, default: null })
  logo: string;

  @Column({ nullable: true, default: null })
  token: string;

  @Column({ default: false })
  verified: Boolean;

  @Column({default: 10})
  role_id: number;

  @Column({ default: null })
  company_id: string;

  // @Column({ type: "enum", enum: ['no', 'bronze', 'silver', 'gold', 'platnum'], default: 'no' })
  // sub_level: string;

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
