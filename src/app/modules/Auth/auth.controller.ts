import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';

const signIn = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.signIn(payload);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User logged in successfully',
    data: result.user,
    token: result.accessToken,
  });
});

const sendAccountRecoverMail = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email
  const result = await AuthServices.sendRecoverAccountVerificationMail(email);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Verification email has been send',
    data: result,
  });
})

const recoverAccount =  catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.recoverAccount(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Verification email has been send',
    data: result,
  });
})

export const AuthControllers = {
  signIn,
  sendAccountRecoverMail,
  recoverAccount
};
