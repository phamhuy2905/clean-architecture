import { z } from 'zod';
import { validateEmail, validatePasswordMatch, validatePasswordStrength } from './base';

export const registerUserSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    const { email, password, confirmPassword } = data;

    // validate email format
    validateEmail(email, ctx);

    // validate password strength
    validatePasswordStrength(password, ctx);

    // validate password match
    validatePasswordMatch(password, confirmPassword, ctx);
});


export type RegisterUserInputs = z.infer<typeof registerUserSchema>;
