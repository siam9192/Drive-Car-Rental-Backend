import { Router } from 'express';
import { UserControllers } from '../User/user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../User/user.validation';
import { AuthValidations } from './auth.validations';
import { AuthControllers } from './auth.controller';
import { Auth } from '../../middlewares/auth';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);
router.post(
  '/signin',
  validateRequest(AuthValidations.signInValidationSchema),
  AuthControllers.signIn,
);
router.post(
  '/recover-account-request',
  AuthControllers.sendAccountRecoverMail,
);
router.post(
  '/recover-account',
  AuthControllers.recoverAccount,
);
router.put('/update-user',Auth('user'),UserControllers.updateUser)

router.get('/get-me', Auth('admin', 'user'), UserControllers.getUser);

export const AuthRouter = router;
