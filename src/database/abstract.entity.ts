/* eslint-disable prettier/prettier */
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
