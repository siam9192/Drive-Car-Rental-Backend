import { Router } from 'express';
import { Auth } from '../../middlewares/auth';
import { UserControllers } from './user.controller';

const router = Router();

router.get('/', Auth('admin'), UserControllers.getUsers);
router.patch('/change-role/:id',Auth('admin'),UserControllers.changeUserRoleInto)
router.put('/user', Auth('admin'));
export const UserRouter = router;
