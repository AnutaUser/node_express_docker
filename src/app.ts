import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { configs } from './configs';
import { ApiError } from './errors';
import { userRouter } from './routers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.use((err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});
app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  // eslint-disable-next-line no-console
  console.log(`work on port: ${configs.PORT} 😎️`);
});
