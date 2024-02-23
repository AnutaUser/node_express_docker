import { Router } from 'express';

import { carController } from '../controllers';
import {
  authMiddleware,
  carMiddleware,
  commonMiddleware,
  fileMiddleware,
} from '../middlewares';
import { CarValidator } from '../validators';

const router = Router();

router.get('/', carController.getAll);
router.post(
  '/',
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create,
);

router.get(
  '/:carId',
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);
router.put(
  '/:carId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.update,
);
router.delete(
  '/:carId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  carController.delete,
);

router.post(
  '/:carId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  fileMiddleware.isPhotoValid,
  carController.uploadPhoto,
);

router.delete(
  '/:carId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  carController.deletePhoto,
);

export const carRouter = router;
