import cds from '@sap/cds';
import { Spacefarer, Spacefarers } from '#cds-models/SpacefarerService';
import type { TypedRequest } from '../types/cds.js';
import { validateAndEnhance, ValidationError } from './spacefarer-validator.js';
import { MailSenderService } from './email-service.js';

const log = cds.log('spacefarer-service');

export default class SpacefarerService extends cds.ApplicationService {
  private readonly mailSender = new MailSenderService();

  async init(): Promise<void> {

    this.before('CREATE', Spacefarers, (req: TypedRequest<Spacefarer>) => {
      try {
        validateAndEnhance(req.data);
      } catch (e) {
        if (e instanceof ValidationError) return req.reject(400, e.message);
        throw e;
      }
    });

    this.after('CREATE', Spacefarers, async (created: Spacefarer[]) => {
      // CDS passes a single entity for single CREATE at runtime, but the type definition expects any[] — handle both cases
      const spacefarer = (Array.isArray(created) ? created[0] : created) as Spacefarer;

      try {
        await this.mailSender.send({
          to: spacefarer.email ?? '',
          subject: 'Welcome to Galactic Spacefarer Adventure!',
          text: `🚀 Welcome, ${spacefarer.firstName} ${spacefarer.lastName}!`
        });
      } catch (err) {
        // Email is non-critical — log the failure but let the CREATE succeed
        log.warn(`Failed to send welcome email to ${spacefarer.email}`, err);
      }
    });

    return super.init();
  }
}
