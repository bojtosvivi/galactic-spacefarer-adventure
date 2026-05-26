import { describe, it, expect, afterEach, vi } from 'vitest';

vi.mock('nodemailer', async () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail: vi.fn() }),
    createTestAccount: vi.fn(),
    getTestMessageUrl: vi.fn().mockReturnValue(false),
  },
}));

import { createTransporter } from '../srv/email-service.js';
import nodemailer from 'nodemailer';

const SMTP_CONFIG = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'user@example.com',
  SMTP_PASS: 'secret',
  SMTP_FROM: 'from@example.com',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('createTransporter', () => {
  it('creates an SMTP transporter when config is present', async () => {
    for (const [key, value] of Object.entries(SMTP_CONFIG)) vi.stubEnv(key, value);

    const { from } = await createTransporter();

    expect(from).toBe('from@example.com');
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'smtp.example.com', port: 587 })
    );
    expect(nodemailer.createTestAccount).not.toHaveBeenCalled();
  });

  it('creates an Ethereal transporter when config is missing', async () => {
    vi.mocked(nodemailer.createTestAccount).mockResolvedValue({
      user: 'mock@ethereal.email',
      pass: 'mockpass',
      smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
    } as any);

    const { from } = await createTransporter();

    expect(from).toContain('mock@ethereal.email');
    expect(nodemailer.createTestAccount).toHaveBeenCalledOnce();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'smtp.ethereal.email' })
    );
  });
});
