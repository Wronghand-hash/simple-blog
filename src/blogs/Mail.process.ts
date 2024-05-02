import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('mailService')
export class userMailService {
  @Process('mail-service')
  handleMails(job: Job) {
    // sending mails on queue through redis

    console.log('mail sent');
  }
}
