import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { Car } from '../Car/car.model';
import { User } from '../User/user.model';
import { Booking } from './Booking.model';
import { TBooking, TBookingRequest } from './booking.interface';
import mongoose from 'mongoose';
import { Response } from 'express';
import { sslcommerzPayment } from '../../payment/sslCommez';
import { amarPayPayment } from '../../payment/amarPay';
import { stripePayment } from '../../payment/stripePayment';
import config from '../../config';

const createBookingIntoDB = async (payload: TBookingRequest) => {
  const car = await Car.isCarExists(payload.carId.toString());
  // Checking is the car exists on the database or is the car deleted
  if (!car || car.isDeleted) {
    throw new AppError(400, 'Car not found');
  }

  const user = await User.findOne({ email: payload.email });

  // Checking is the user exists on the database
  if (!user) {
    throw new AppError(400, 'User not found');
  }

  const booking = {
    user: user._id,
    ...payload,
    car: car._id,
  };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userBooking = await Booking.create([booking], { session });
    const updatedCarStatus = await Car.findByIdAndUpdate(
      car._id,
      { status: 'unavailable' },
      { session, new: true, runValidators: true },
    );

    // If booking is unsuccessful or updating car status is unsuccessful it  will role back
    if (!userBooking.length || !updatedCarStatus) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();
    return await Booking.findById(userBooking[0]._id.toString());
  } catch (err: any) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Booking is unsuccessful');
  }
};

const returnTheCar = async (payload: {
  bookingId: string;
}) => {
  const { bookingId } = payload;

  const booking = await Booking.isBookingExists(bookingId);

  // Checking is the booking exists in the database
  if (!booking) {
    throw new AppError(400, 'Booking  not found');
  }

  const car = await Car.isCarExists(booking.car.toString());
  const startTime = new Date(booking.startTime).valueOf()
  const endTime = new Date().valueOf()

  const hours = ((endTime-startTime)/1000)/60

  let totalCost = 0;

  // Calculating total cost of booking
  if (car?.pricePerHour) {
    totalCost = hours * car.pricePerHour / 60;
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Updating car status unavailable to available
    const updatedCarStatus = await Car.findByIdAndUpdate(
      car._id,
      { status: 'available' },
      { session, runValidators: true },
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { endTime: endTime, totalCost, isBooked: 'confirmed',isReturned:true,status:'returned'},
      { new: true, session },
    ).populate([{ path: 'car' }, { path: 'user' }]);

    if (!updatedCarStatus || !updatedBooking) {
      throw new Error();
    }
    await session.commitTransaction();
    await session.endSession();
    return updatedBooking;
  } catch {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Return the car unsuccessful');
  }
};
const updateBookingIntoDB = async (id: string, payload: TBooking) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  if (
    payload.status &&
    payload.status === 'approved' &&
    booking.status === 'canceled'
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Canceled booking can not be update',
    );
  }
  if (payload.status === 'canceled') {
    await Car.findByIdAndUpdate(booking.car.toString(), {
      status: 'available',
    });
  }
  const result = await Booking.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const getAllBookingsFromDB = async (query: any) => {
  const { carId, date } = query;
  const filter: any = {};
  if (carId) {
    filter.car = new mongoose.Types.ObjectId(carId);
  }

  if (date) {
    filter.date = date;
  }

  const result = await Booking.find(filter).populate([
    { path: 'car' },
    { path: 'user' },
  ]);
  return result.reverse();
};
const getBookingFromDB = async (id:string) => {
  const result = await Booking.findById(id).populate([
    { path: 'car' },
    { path: 'user' },
  ]);
  
  return result;
};

const getReturnableBookingsFromDB = async (query: any) => {
  
  const filter = {
    status:'approved',
    isReturned:false,
    isBooked:'confirmed'
  }
  const result = await Booking.find(filter).populate([
    { path: 'car' },
    { path: 'user' },
  ]);
  return result;
};
const getAllUserBookingsFromDB = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return [];
  }
  
  const result = await Booking.find({ user: user?._id }).sort({createdAt:-1}).populate([
    { path: 'user' },
    { path: 'car' },
  ]);
  return result;
};
const getYetToPaymentBookingsFromDB  = async (email: string) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    return [];
  }
  const result = await Booking.find({ user: user?._id,isPaid:false,isReturned:true}).sort({createdAt:-1}).populate([
    { path: 'user' },
    { path: 'car' },
  ]);
  return result;
};
const confirmBookingIntoDB = async (id: string) => {
  const booking = Booking.findById(id,{isBooked:'unconfirmed'})
  if(!booking){
    throw new AppError(httpStatus.NOT_FOUND,'Booking not found')
  }
  return await Booking.findByIdAndUpdate(id,{isBooked:'confirmed'})
};

const HandelBookingPaymentRequest = async(res:Response,payload:{bookingId:string,method:'ssl'|'amarpay'|'stripe'})=>{

  const booking:any = await Booking.findById(payload.bookingId).populate('car');

  // Checking bookingExistence
  if(!booking){
    throw new AppError(httpStatus.NOT_FOUND,'Booking not found')
  }
  else if(booking.isBooked === 'unconfirmed'){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Payment request can not be accepted')
  }
  else if(booking.isPaid){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Already Payed')
  }
  else if(booking.status !== 'returned'){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Payment request can not be accepted ')
  }
 
  const paymentData = {
   tran_id:booking._id.toString(),
   amount:booking.totalCost,
   serviceName:booking.car.name,
   success_url:config.payment_success_url,
   cancel_url:config.payment_cancel_url
  }
  let url:string;
  switch (payload.method){
    case 'ssl':
      url = await sslcommerzPayment(paymentData)
      break;
      case 'amarpay':
      url  = await amarPayPayment(paymentData)
      break;
      case 'stripe':
      url = await  stripePayment(paymentData)
      break
  }
  
  if(!url){
    throw new AppError(404,'Something went wrong')
  }
  return {
    url
  }
}

const manageBookingAfterSuccessPayment = async(res:Response,bookingId:string)=>{
  try {
    const booking = Booking.findById(bookingId)
    if(!booking){
      throw new Error()
    }  
   } catch (error) {
    throw new AppError(400,'Something went wrong')
   }

 await Booking.findByIdAndUpdate(bookingId,{isPaid:true})
 return {
  url:'/dashboard/manage-payments'
}
}

const cancelBookingIntoDB = async(bookingId:string)=>{
const booking = await Booking.findById(bookingId)
if(!booking){
  throw new AppError(httpStatus.NOT_FOUND,'Booking not found')
}
if(booking.status  !== 'pending'){
  throw new AppError(httpStatus.NOT_ACCEPTABLE,'Booking can not be cancel now')
}
 
 await Car.findByIdAndUpdate(booking.car.toString(),{status:'available'})
 return await Booking.findByIdAndUpdate(bookingId,{status:'canceled'})
}

export const BookingServices = {
  createBookingIntoDB,
  returnTheCar,
  updateBookingIntoDB,
  getAllBookingsFromDB,
  getAllUserBookingsFromDB,
  getReturnableBookingsFromDB,
  getYetToPaymentBookingsFromDB,
  HandelBookingPaymentRequest,
  manageBookingAfterSuccessPayment,
  confirmBookingIntoDB,
  getBookingFromDB,
  cancelBookingIntoDB
};
