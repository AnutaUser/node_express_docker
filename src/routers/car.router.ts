import { Router } from 'express';

import { carController } from '../controllers';
import { authMiddleware, commonMiddleware } from '../middlewares';
import { CarValidator } from '../validators';

const router = Router();

router.get('/', carController.getAll);
router.post(
  '/',
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create,
);

router.get('/:carId', carController.getById);
router.put(
  '/:carId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.update,
);
router.delete('/:carId', authMiddleware.checkAccessToken, carController.delete);

export const carRouter = router;
