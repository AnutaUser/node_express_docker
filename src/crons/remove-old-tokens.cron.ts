import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Token } from '../models';

dayjs.extend(utc);

const tokensRemover = async () => {
  const previousMonth = dayjs().utc().subtract(1, 'month').toString();

  await Token.deleteMany({
    createdAt: { $lte: previousMonth },
  });
};

export const removeOldTokens = new CronJob('5 * * * * *', tokensRemover);

// 2023-12-24T11:12:25.006Z toJSON

// 2023-12-24T11:13:20.005Z toISOString

// 2023-12-24T11:14:00.005Z toDate

// Sun, 24 Dec 2023 11:14:35 GMT toString
