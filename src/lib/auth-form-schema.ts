import { z } from 'zod';

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email(),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});
const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email(),
  password: z.string().min(6, {
    message: 'Minimum 6 characters is required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export { LoginSchema, RegisterSchema };
