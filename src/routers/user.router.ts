import { Router } from 'express';

import { userController } from '../controllers';
import { commonMiddleware } from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.get('/', userController.findAll);

router.get(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  userController.getById,
);
router.patch(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.update,
);
router.delete(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  userController.delete,
);

export const userRouter = router;
