import { rateLimit } from 'express-rate-limit';

export const limiterUtil = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  message: 'You can not make any more requests at the moment. Try again later',
});
