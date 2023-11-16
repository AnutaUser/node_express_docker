import { Router } from 'express';

import { userController } from '../controllers';
import { authMiddleware, commonMiddleware } from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.get('/', userController.findAll);

router.get(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  authMiddleware.checkAccessToken,
  userController.getById,
);
router.patch(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAccessToken,
  userController.update,
);
router.delete(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  authMiddleware.checkAccessToken,
  userController.delete,
);

export const userRouter = router;
