import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import { configs } from './configs';
import { cronRunner } from './crons';
import { ApiError } from './errors';
import { authRouter, carRouter, userRouter } from './routers';
import { limiterUtil } from './utils';
import swaggerJson from './utils/swagger.json';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiterUtil);

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

const dbConnect = async () => {
  let dbCon = false;

  while (!dbCon) {
    try {
      // eslint-disable-next-line no-console
      console.log('Connecting to database', configs.DB_URL);
      await mongoose.connect(configs.DB_URL);
      dbCon = true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Database unavailable, wait 3 seconds');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

const start = async () => {
  try {
    await dbConnect();
    await app.listen(configs.PORT, () => {
      cronRunner();
      // eslint-disable-next-line no-console
      console.log(`Work on port: ${configs.PORT} 😎️`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

start();
