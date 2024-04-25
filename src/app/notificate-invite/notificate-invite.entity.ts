import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class NotificateInvite  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  company_id: string;

  @Column({ default: null })
  inviter: number;

  @Column({ default: null })
  requester: number;

  @Column({ length: 500, default: null })
  requester_email: string;

  @Column({ length: 500, default: null })
  inviter_email: string;

  @Column({ length: 500, default: null })
  token: string;

  @Column({ default: false })
  status: boolean;

  @Column({ default: true })
  toRequester: boolean;

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
