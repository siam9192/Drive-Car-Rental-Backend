import AppError from '../../Errors/AppError';
import { User } from '../User/user.model';
import { TJwtPayload, TSignIn } from './auth.interface';
import { CreateAccessToken, MatchPassword } from './auth.utils';
import config from '../../config';
import httpStatus from 'http-status';
import { generateOTP } from '../../utils/func';
import { sendAccountRecoverMail } from '../../utils/sendEmail';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const signIn = async (payload: TSignIn) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  // Checking is the user exists in the database
  if (!user) {
    throw new AppError(400, 'Incorrect email');
  }

  const { password: userPassword } = user;

  // Matching  user password
  const matchUserPassword = await MatchPassword(payload.password, userPassword);

  if (!matchUserPassword) {
    throw new AppError(400, 'Incorrect password');
  }

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role,
    userId: user._id.toString(),
  };

  // Creating access token
  const accessToken = CreateAccessToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expire_time as string,
  );

  const userData = await User.findOne({ email: payload.email });
  return {
    user: userData,
    accessToken,
  };
};

const sendRecoverAccountVerificationMail = async(email:string)=>{
const user = await User.findOne({email})
// checking user existence
if(!user){
  throw new AppError(httpStatus.NOT_FOUND,"Do not have any account on this email")
}
// verification  generating otp code
const otp = generateOTP();

await sendAccountRecoverMail({name:user.name,otp,email})

 const data = jwt.sign({email,otp},config.jwt_access_secret as string,{expiresIn:'20m'})
 return data

}

const recoverAccount = async(payload:{email:string,password:string})=>{
  const user = await User.findOne({email:payload.email})
 
  // checking user existence
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND,"Do not have any account on this email")
  }
  
const password =   await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(user._id.toString(),{password},{new:true})
  return null

}
export const AuthServices = {
  signIn,
  sendRecoverAccountVerificationMail,
  recoverAccount

};
