import { Router } from 'express';

import { userController } from '../controllers';
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
} from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.get('/', userController.findAll);

router.get(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.getById,
);
router.patch(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.update,
);
router.delete(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.delete,
);
router.post(
  '/:userId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  fileMiddleware.isPhotoValid,
  userController.uploadPhoto,
);
router.delete(
  '/:userId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.deletePhoto,
);

export const userRouter = router;
