import { describe, it, expect } from 'vitest';
import { validateAndEnhance, ValidationError } from '../srv/spacefarer-validator.js';

const VALID_BASE = {
  originPlanet_ID: 'some-planet-id',
  firstName: 'Zara',
  lastName: 'Nova',
  email: 'zara@planet.space',
};

describe('validateAndEnhance', () => {
  describe('validation', () => {
    it('throws ValidationError for an invalid email', () => {
      expect(() => validateAndEnhance({ ...VALID_BASE, email: 'not-an-email' }))
        .toThrow(ValidationError);
    });
    it('does not throw for valid input', () => {
      expect(() => validateAndEnhance({ ...VALID_BASE })).not.toThrow();
    });
  });

  describe('email normalisation', () => {
    it('lowercases the email', () => {
      const data = { ...VALID_BASE, email: 'ZARA@PLANET.SPACE' };
      validateAndEnhance(data);
      expect(data.email).toBe('zara@planet.space');
    });

    it('trims whitespace from the email', () => {
      const data = { ...VALID_BASE, email: '  zara@planet.space  ' };
      validateAndEnhance(data);
      expect(data.email).toBe('zara@planet.space');
    });
  });

  describe('stardustCollection bonus', () => {
    it('adds +100 to a fresh spacefarer (default 0)', () => {
      const data = { ...VALID_BASE, stardustCollection: 0 };
      validateAndEnhance(data);
      expect(data.stardustCollection).toBe(100);
    });

    it('adds +100 on top of an existing value', () => {
      const data = { ...VALID_BASE, stardustCollection: 500 };
      validateAndEnhance(data);
      expect(data.stardustCollection).toBe(600);
    });

    it('assumes 0 when stardustCollection is undefined', () => {
      const data = { ...VALID_BASE, stardustCollection: undefined };
      validateAndEnhance(data);
      expect(data.stardustCollection).toBe(100);
    });

    it('caps at 100 000', () => {
      const data = { ...VALID_BASE, stardustCollection: 99_999 };
      validateAndEnhance(data);
      expect(data.stardustCollection).toBe(100_000);
    });

    it('does not exceed 100 000 even when already at max', () => {
      const data = { ...VALID_BASE, stardustCollection: 100_000 };
      validateAndEnhance(data);
      expect(data.stardustCollection).toBe(100_000);
    });
  });

  describe('wormholeNavigationSkill bonus', () => {
    it('adds +5 to a fresh spacefarer (default 0)', () => {
      const data = { ...VALID_BASE, wormholeNavigationSkill: 0 };
      validateAndEnhance(data);
      expect(data.wormholeNavigationSkill).toBe(5);
    });

    it('adds +5 on top of an existing value', () => {
      const data = { ...VALID_BASE, wormholeNavigationSkill: 80 };
      validateAndEnhance(data);
      expect(data.wormholeNavigationSkill).toBe(85);
    });

    it('caps at 100', () => {
      const data = { ...VALID_BASE, wormholeNavigationSkill: 97 };
      validateAndEnhance(data);
      expect(data.wormholeNavigationSkill).toBe(100);
    });

    it('does not exceed 100 even when already at max', () => {
      const data = { ...VALID_BASE, wormholeNavigationSkill: 100 };
      validateAndEnhance(data);
      expect(data.wormholeNavigationSkill).toBe(100);
    });
  });
});
