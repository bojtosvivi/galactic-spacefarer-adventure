import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const mockLog = vi.hoisted(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }));

vi.mock('@sap/cds', () => ({
  default: { log: () => mockLog },
}));

vi.mock('nodemailer', async () => ({
  default: {
    createTransport: vi.fn(),
    createTestAccount: vi.fn(),
    getTestMessageUrl: vi.fn().mockReturnValue(false),
  },
}));

import { MailSenderService } from '../srv/email-service.js';
import nodemailer from 'nodemailer';

const SMTP_CONFIG = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'user@example.com',
  SMTP_PASS: 'secret',
  SMTP_FROM: 'from@example.com',
};

const message = { to: 'alien@mars.com', subject: 'Welcome', text: 'Hello spacefarer!' };

let sendMail: ReturnType<typeof vi.fn>;

beforeEach(() => {
  for (const [key, value] of Object.entries(SMTP_CONFIG)) vi.stubEnv(key, value);
  sendMail = vi.fn().mockResolvedValue({});
  vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as any);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('MailSenderService.send', () => {
  it('sends mail with the correct from/to/subject/text', async () => {
    const service = new MailSenderService();
    await service.send(message);

    expect(sendMail).toHaveBeenCalledOnce();
    expect(sendMail).toHaveBeenCalledWith({
      from: 'from@example.com',
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  });

  it('propagates the error when sendMail rejects', async () => {
    sendMail.mockRejectedValue(new Error('SMTP connection failed'));
    const service = new MailSenderService();

    await expect(service.send(message)).rejects.toThrow('SMTP connection failed');
  });

  it('logs the Ethereal preview URL when getTestMessageUrl returns a string', async () => {
    const previewUrl = 'https://ethereal.email/message/abc123';
    vi.mocked(nodemailer.getTestMessageUrl).mockReturnValue(previewUrl);

    const service = new MailSenderService();
    await service.send(message);

    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining(previewUrl));
  });
});
