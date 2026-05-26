import { describe, it, expect, afterEach, vi } from 'vitest';
import { getSmtpConfig } from '../srv/email-service.js';

const SMTP_CONFIG = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'user@example.com',
  SMTP_PASS: 'secret',
  SMTP_FROM: 'from@example.com',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('getSmtpConfig', () => {
  it('returns undefined when SMTP config is not set', () => {
    expect(getSmtpConfig()).toBeUndefined();
  });

  it('defaults port to 587 when SMTP_PORT is not a valid number', () => {
    for (const [key, value] of Object.entries(SMTP_CONFIG)) vi.stubEnv(key, value);
    vi.stubEnv('SMTP_PORT', 'invalid');

    expect(getSmtpConfig()?.port).toBe(587);
  });
});
