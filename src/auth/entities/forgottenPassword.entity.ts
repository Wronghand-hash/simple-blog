import { AbstractEntity } from '../../database/abstract.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class ForgottenPassword extends AbstractEntity<ForgottenPassword> {
  @Column()
  email: string;

  @Column()
  passToken: string;

  @CreateDateColumn()
  timestamp: Date;
}
