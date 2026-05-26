import { isEmail } from 'validator';
import type { Spacefarer } from '#cds-models/SpacefarerService';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateAndEnhance(data: Partial<Spacefarer>): void {
  if (data.email != null) {
    data.email = data.email.toLowerCase().trim();
    if (!isEmail(data.email)) {
      throw new ValidationError('Invalid email address.');
    }
  }

  data.stardustCollection      = Math.min((data.stardustCollection      ?? 0) + 100, 100_000);
  data.wormholeNavigationSkill = Math.min((data.wormholeNavigationSkill ?? 0) + 5,   100);
}
