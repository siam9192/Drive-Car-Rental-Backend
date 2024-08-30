import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });
  // checking user existence
  if (user) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Already have an account on this email',
    );
  }
  const result = await User.create(payload);

  return result;
};
const changeUserRoleIntoDB  = async(id:string,payload:Pick<TUser,'role'>)=>{
  const user = await User.findById(id);
// checking user existence
if (!user) {
  throw new AppError(
    httpStatus.NOT_FOUND,
    'User not found',
  );
}
const result = await  User.findByIdAndUpdate(id,{role:payload.role},{new:true})
return result 
}

const updateUserIntoDB = async (userId:string,payload:Pick<TUser,'name'|'phone'|'address'>)=>{
 
const result = await User.findByIdAndUpdate(userId,payload,{new:true})
return result
}

const getUserFromDB = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};
const getUsersFromDB = async () => {
  const result = await User.find();
  return result;
};
export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getUserFromDB,
  getUsersFromDB,
  changeUserRoleIntoDB
};
