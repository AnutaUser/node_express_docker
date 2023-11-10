import { Router } from 'express';

import { userController } from '../controllers';
import { userMiddleware } from '../middlewares';

const router = Router();

router.get('/', userController.findAll);
router.post('/', userMiddleware.isCreateValid, userController.create);

router.get('/:userId', userController.getById);
router.patch('/:userId', userController.update);
router.delete('/:userId', userController.delete);

export const userRouter = router;
