import { z } from 'zod';
import { CarStatus } from './car.constant';

const createCarValidationSchema = z.object({
  name: z.string(),
  brand: z.string(),
  images: z.array(z.string()),
  description: z.string(),
  type: z.string(),
  color: z.string(),
  isElectric: z.boolean(),
  features: z.array(z.string()).optional(),
  insurances: z.array(z.string()).optional(),
  locations: z.array(z.string()),
  pricePerHour: z.number(),
});

const carUpdateValidationSchema = createCarValidationSchema.partial();

export const CarValidations = {
  createCarValidationSchema,
  carUpdateValidationSchema,
};
