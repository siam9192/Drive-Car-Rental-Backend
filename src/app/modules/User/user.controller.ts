import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: 201,
    status: true,
    message: 'User registered successfully',
    data: result,
  });
});
const changeUserRoleInto = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body;
  const result = await UserServices.changeUserRoleIntoDB(id,payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: 'User role changed successfully',
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.userId
  const payload = req.body;
  const result = await UserServices.updateUserIntoDB(id,payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await UserServices.getUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: 'User data retrieved successfully',
    data: result,
  });
});
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: 'Users data retrieved successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  changeUserRoleInto,
  updateUser,
  getUser,
  getUsers,
};
