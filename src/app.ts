import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import { configs } from './configs';
import { cronRunner } from './crons';
import { ApiError } from './errors';
import { authRouter, carRouter, userRouter } from './routers';
import { corsUtil, limiterUtil } from './utils';
import swaggerJson from './utils/swagger.json';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiterUtil);
app.use(corsUtil);

app.use(fileUpload());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/cars', carRouter);
app.use('/documentations', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});
app.listen(configs.PORT, async () => {
  await cronRunner();
  await mongoose.connect(configs.DB_URL);
  // eslint-disable-next-line no-console
  console.log(`work on port: ${configs.PORT} 😎️`);
});
