import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ConsentRegistary extends AbstractEntity<ConsentRegistary> {
  @Column()
  email: String;

  @Column()
  checkboxText: String;

  @Column()
  privacyPolicy: String;

  @Column()
  cookiePolicy: String;

  @Column()
  acceptedPolicy: String;
}
