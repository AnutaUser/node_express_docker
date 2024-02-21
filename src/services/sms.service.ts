import { Twilio } from 'twilio';

import { configs } from '../configs';
import { smsConstant } from '../constants';
import { ESmsActions } from '../enums';
import { ApiError } from '../errors';

class SmsService {
  constructor(
    private client = new Twilio(
      configs.TWILIO_ACCOUNT_SID,
      configs.TWILIO_AUTH_TOKEN,
    ),
  ) {}

  public async sendSMS(phone: string, action: ESmsActions, userName: string) {
    try {
      const template = smsConstant[action];

      await this.client.messages.create({
        body: template(userName),
        messagingServiceSid: configs.TWILIO_SERVICE_SID,
        to: phone,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const smsService = new SmsService();
