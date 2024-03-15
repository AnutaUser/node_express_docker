import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// import { number } from 'joi';
// import { ESmsActions } from '../enums';
import { Token, User } from '../models';
// import { smsService } from '../services/sms.service';

dayjs.extend(utc);

const reminder = async (): Promise<void> => {
  const monthAgo = dayjs().utc().subtract(1, 'month');

  const oldTokens = await Token.find({ createdAt: { $lte: monthAgo } });

  const ids = oldTokens.map((token) => token._user);

  const users = await User.find({ _id: { $in: ids } });

  const phones = users.map((user) => user.phone);
  const names = users.map((user) => user.username);
  console.log(phones, names);

  // phones.map(async (phone) => {
  //   names.map(async (userName) => {
  //     await smsService.sendSms(phone, ESmsActions.REMINDER, userName);
  //   });
  // });
};

export const remindSMS = new CronJob('* * 2 * * *', reminder);
