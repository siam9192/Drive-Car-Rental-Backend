import { z } from 'zod';
import { bookingStatus } from '../Car/car.constant';

const createBookingValidationSchema = z.object({
  carId: z.string(),
  startTime: z.string(),
  pricePerHour: z.number(),
  bookerInfo: z.object({
    nid: z.string().optional(),
    passport: z.string().optional(),
    drivingLicense: z.string().min(1, 'Driving License is required'),
  }),
  additionalOption: z.string().nullable().optional(),
});
const updateBookingValidationSchema = z.object({
  carId: z.string().optional(),
  startTime: z.string().optional(),
  pricePerHour: z.number().optional(),
  status: z.enum(bookingStatus as [string, ...string[]]).optional(),
  bookerInfo: z
    .object({
      nid: z.string().optional(),
      passport: z.string().optional(),
      drivingLicense: z
        .string()
        .min(1, 'Driving License is required')
        .optional(),
    })
    .optional(),
  additionalOption: z.string().nullable().optional(),
});
const updateReturnTheCarValidationSchema = z.object({
  bookingId: z.string(),
});

export const BookingValidations = {
  createBookingValidationSchema,
  updateReturnTheCarValidationSchema,
  updateBookingValidationSchema,
};
