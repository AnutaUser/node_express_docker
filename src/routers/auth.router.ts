import { Router } from 'express';

import { authController } from '../controllers';
import { commonMiddleware, userMiddleware } from '../middlewares';
import { ICredential } from '../types';
import { UserValidator } from '../validators';

const router = Router();

router.post(
  '/register',
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.register,
);

router.post(
  '/login',
  userMiddleware.isUserExist<ICredential>('email'),
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);

export const authRouter = router;
