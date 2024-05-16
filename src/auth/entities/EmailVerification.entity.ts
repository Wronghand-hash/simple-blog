import { AbstractEntity } from '../../database/abstract.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class EmailVerification extends AbstractEntity<EmailVerification> {
  @Column()
  email: string;

  @Column()
  emailToken: string;

  @CreateDateColumn()
  timestamp: Date;
}
