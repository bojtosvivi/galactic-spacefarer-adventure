import nodemailer, { Transporter } from 'nodemailer';
import cds from '@sap/cds';

const log = cds.log('mail');

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface MailSender {
  send(message: EmailMessage): Promise<void>;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function getSmtpConfig(): SmtpConfig | undefined {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return undefined;
  }

  const port = Number(SMTP_PORT) || 587;
  if (!Number(SMTP_PORT)) log.warn(`Mail: invalid SMTP_PORT "${SMTP_PORT}", defaulting to 587`);

  return { host: SMTP_HOST, port, user: SMTP_USER, pass: SMTP_PASS, from: SMTP_FROM };
}

export async function createTransporter(): Promise<{ transporter: Transporter; from: string }> {
  const smtpConfig = getSmtpConfig();
  if (smtpConfig) {
    log.info(`Mail: using real SMTP transporter (${smtpConfig.host}:${smtpConfig.port})`);
    return {
      transporter: nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        auth: { user: smtpConfig.user, pass: smtpConfig.pass },
      }),
      from: smtpConfig.from,
    };
  }

  log.info('Mail: no SMTP config found, falling back to Ethereal test account');
  try {
    const account = await nodemailer.createTestAccount();
    log.info(`Mail: Ethereal test account created (${account.user})`);
    return {
      transporter: nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: { user: account.user, pass: account.pass },
      }),
      from: `"Galactic Spacefarer Adventure" <${account.user}>`,
    };
  } catch (err) {
    log.error(`Mail: failed to create Ethereal test account — email sending will be unavailable`, err);
    throw err;
  }
}

export class MailSenderService implements MailSender {
  private readonly transporterPromise = createTransporter();

  async send(message: EmailMessage): Promise<void> {
    const { transporter, from } = await this.transporterPromise;

    const info = await transporter.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });

    // getTestMessageUrl returns a URL only for Ethereal, false for real SMTP
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      log.info(`Mail: preview URL → ${previewUrl}`);
    } else {
      log.info(`Mail: sent to ${message.to}`);
    }
  }
}
