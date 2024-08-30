import { string, z } from 'zod';
import { UserRoles } from './user.constant';

const createUserValidationSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  email: z.string({ required_error: 'email is required' }),
  password: z.string({ required_error: 'password is required' }),
  role: z.enum([...UserRoles] as [string, ...string[]]),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const UserValidations = {
  createUserValidationSchema,
};
