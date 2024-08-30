import { Schema, model } from 'mongoose';
import { TCar, TCarStaticMethods } from './car.interface';
import { CarStatus } from './car.constant';

const carModelSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },
   type: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isElectric: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: CarStatus,
      default: 'available',
    },
    features: {
      type: [String],
      default: [],
    },
    insurances: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

carModelSchema.statics.isCarExists = async (carId) => {
  return await Car.findById(carId);
};

export const Car = model<TCar, TCarStaticMethods>('Car', carModelSchema);
