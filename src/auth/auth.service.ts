import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ForgottenPassword } from './entities/forgottenPassword.entity';
import { EmailVerification } from './entities/EmailVerification.entity';
import { ConsentRegistary } from './entities/consentRegistary.entity';
import { SigninDto } from 'src/users/dto/signin.dto';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationModel: Repository<EmailVerification>,
    @InjectRepository(ForgottenPassword)
    private readonly forgottenPasswordModel: Repository<ForgottenPassword>,
    @InjectRepository(ConsentRegistary)
    private readonly consentRegistryModel: Repository<ConsentRegistary>,
    private readonly jwtService: JWTService,
    private readonly httpService: HttpService,
    private readonly entityManager: EntityManager,
  ) {}

  async validateLogin(email, password) {
    const userFromDb = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if (!userFromDb.valid)
      throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);

    let isValidPass = await bcrypt.compare(password, userFromDb.password);

    if (isValidPass) {
      var accessToken = await this.jwtService.createToken(
        email,
        userFromDb.roles,
      );
      return { token: accessToken, user: userFromDb };
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }

  async createEmailToken(email: string): Promise<boolean> {
    var emailVerification = await this.emailVerificationModel.findOne({
      where: { email: email },
    });
    if (
      emailVerification &&
      (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'LOGIN.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const emailVerificationModel = await this.emailVerificationModel.findOne({
        where: {
          email: email,
        },
      });
      if (emailVerificationModel) {
        emailVerificationModel.email = email;
        (emailVerificationModel.emailToken = (
          Math.floor(Math.random() * 9000000) + 1000000
        ).toString()), //Generate 7 digits number
          (emailVerificationModel.timestamp = new Date()),
          await this.entityManager.save(emailVerificationModel);
      } else {
        try {
          const emailVerificationModel = new EmailVerification({
            email: email,
            emailToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(),
            timestamp: new Date(),
          });

          await this.entityManager.save(emailVerificationModel);
        } catch (error) {
          console.log(error);
        }
      }

      return true;
    }
  }

  async setPassword(email: string, newPassword: string) {
    const userFromDb = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    userFromDb.password = await bcrypt.hash(newPassword);

    await this.entityManager.save(userFromDb);
    return true;
  }

  async saveUserConsent(email: string) {
    //TODO: replace with your site url containing the updated version of the consent form
    const privacyPolicyURL = 'https://www.[yoursite].com/api/privacy-policy';
    const cookiePolicyURL = 'https://www.[yoursite].com/api/cookie-policy';
    // try {
    //   var newConsent = new this.consentRegistryModel();
    //   newConsent.email = email;
    //   newConsent.date = new Date();
    //   newConsent.registrationForm = [
    //     'name',
    //     'surname',
    //     'email',
    //     'birthday date',
    //     'password',
    //   ];
    //   newConsent.checkboxText = 'I accept privacy policy';
    //   var privacyPolicyResponse: any = await lastValueFrom(
    //     this.httpService.get(privacyPolicyURL),
    //   );
    //   newConsent.privacyPolicy = privacyPolicyResponse.data;
    //   var cookiePolicyResponse: any = await lastValueFrom(
    //     this.httpService.get(cookiePolicyURL),
    //   );
    //   newConsent.cookiePolicy = cookiePolicyResponse.data;
    //   newConsent.acceptedPolicy = 'Y';
    //   return await newConsent.save();
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async createForgottenPasswordToken(
    email: string,
  ): Promise<ForgottenPassword> {
    const forgottenPassword = await this.forgottenPasswordModel.findOne({
      where: { email: email },
    });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      if (forgottenPassword) {
        const forgottenPasswordModel =
          await this.forgottenPasswordModel.findOne({
            where: { email: email },
          });

        if (forgottenPasswordModel) {
          forgottenPasswordModel.email = email;
          forgottenPasswordModel.passToken = (
            Math.floor(Math.random() * 900000) + 1000000
          ).toString();
          forgottenPasswordModel.timestamp = new Date();
        } else {
          const forgottenPasswordRow = new ForgottenPassword({
            email: email,
            passToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(),
            timestamp: new Date(),
          });

          await this.entityManager.save(forgottenPasswordRow);
        }
        return forgottenPasswordModel;
      }
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerificationModel.findOne({
      where: { emailToken: token },
    });
    if (emailVerif && emailVerif.email) {
      var userFromDb = await this.userRepository.findOne({
        where: { email: emailVerif.email },
      });
      if (userFromDb) {
        userFromDb.valid = true;
        const savedUser = await this.entityManager.save(userFromDb);
        return !!savedUser;
      }
    } else {
      throw new HttpException(
        'LOGIN.EMAIL_CODE_NOT_VALID',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getForgottenPasswordModel(
    newPasswordToken: string,
  ): Promise<ForgottenPassword> {
    return await this.forgottenPasswordModel.findOne({
      where: { passToken: newPasswordToken },
    });
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    var model = await this.emailVerificationModel.findOne({
      where: {
        email: email,
      },
    });

    if (model && model.emailToken) {
      let transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        secure: process.env.secure, // true for 465, false for other ports
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      let mailOptions = {
        from: '"Company" <' + process.env.user + '>',
        to: email, // list of receivers (separated by ,)
        subject: 'Verify Email',
        text: 'Verify Email',
        html:
          'Hi! <br><br> Thanks for your registration<br><br>' +
          '<a href=' +
          process.env.url +
          ':' +
          process.env.port +
          '/auth/email/verify/' +
          model.emailToken +
          '>Click here to activate your account</a>', // html body
      };

      var sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });
      });

      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkPassword(email: string, password: string) {
    var userFromDb = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var userFromDb = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    var tokenModel = await this.createForgottenPasswordToken(email);

    if (tokenModel && tokenModel.passToken) {
      let transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        secure: process.env.secure, // true for 465, false for other ports
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      let mailOptions = {
        from: '"Company" <' + process.env.user + '>',
        to: email, // list of receivers (separated by ,)
        subject: 'Frogotten Password',
        text: 'Forgot Password',
        html:
          'Hi! <br><br> If you requested to reset your password<br><br>' +
          '<a href=' +
          process.env.url +
          ':' +
          process.env.port +
          '/auth/email/reset-password/' +
          tokenModel.passToken +
          '>Click here</a>', // html body
      };

      var sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });
      });

      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
