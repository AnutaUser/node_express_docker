import * as path from 'node:path';

import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import { configs } from '../configs';
import { emailConstant } from '../constants';
import { EEmailActions } from '../enums';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      from: 'no reply',
      service: 'gmail',
      auth: {
        user: configs.NODEMAILER_USER,
        pass: configs.NODEMAILER_PASS,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(
          process.cwd(),
          'src',
          'email-templates',
          'layouts',
        ),
        partialsDir: path.join(
          process.cwd(),
          'src',
          'email-templates',
          'partials',
        ),
      },
      viewPath: path.join(process.cwd(), 'src', 'email-templates', 'views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
  }

  public async sendMail(
    email: string,
    emailAction: EEmailActions,
    context: Record<string, string | number> = {},
  ) {
    const { templateName, subject } = emailConstant[emailAction];

    context.frontUrl = configs.FRONT_URL;

    const mailOptions = {
      to: email,
      subject,
      template: templateName,
      context,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
