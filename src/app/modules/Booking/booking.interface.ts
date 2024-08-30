import mongoose, { Model } from 'mongoose';

export type TBooking = {
  date: String;
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  pricePerHour: number;
  totalCost: number;
  isBooked?: 'confirmed' | 'unconfirmed';
  status?: 'pending' | 'approved' |'returned'| 'canceled';
  bookerInfo: {
    nid?: string;
    passport?: string;
    drivingLicense: string;
  };
  additionalOption?: string;
  isPaid?: boolean;
  isReturned?: boolean;
  isReviewed?: boolean;
};

export type TBookingRequest = {
  email: string;
  carId: string;
  date: string;
  startTime: string;
};
export interface TBookingStaticsMethods extends Model<TBooking> {
  isBookingExists(bookingId: string): Promise<TBooking>;
}
