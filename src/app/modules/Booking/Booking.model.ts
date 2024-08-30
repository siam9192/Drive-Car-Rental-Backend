import { Schema, model } from 'mongoose';
import { TBooking, TBookingStaticsMethods } from './booking.interface';
import { boolean } from 'zod';
import { bookingStatus } from '../Car/car.constant';

const bookingModelSchema = new Schema<TBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    isBooked: {
      type: String,
      enum: ['confirmed', 'unconfirmed'],
      default: 'unconfirmed',
    },
    status: {
      type: String,
      enum: bookingStatus,
      default: 'pending',
    },
    bookerInfo: {
      nid: {
        type: String,
        default: null,
      },
      passport: {
        type: String,
        default: null,
      },
      drivingLicense: {
        type: String,
        required: true,
      },
    },
    additionalOption: {
      type: String,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

bookingModelSchema.statics.isBookingExists = async (bookingId) => {
  return await Booking.findById(bookingId);
};
export const Booking = model<TBooking, TBookingStaticsMethods>(
  'Booking',
  bookingModelSchema,
);
