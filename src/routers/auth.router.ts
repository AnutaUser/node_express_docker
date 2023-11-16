import { Router } from 'express';

import { authController } from '../controllers';
import { commonMiddleware, userMiddleware } from '../middlewares';
import { ICredential } from '../types';
import { UserValidator } from '../validators';

const router = Router();

router.post(
  '/register',
  commonMiddleware.isBodyValid(UserValidator.create),
  userMiddleware.findAndThrow('email'),
  authController.register,
);

router.post(
  '/login',
  commonMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserExist<ICredential>('email'),
  authController.login,
);

export const authRouter = router;
