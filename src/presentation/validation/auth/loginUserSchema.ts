import { z } from 'zod';
import { validateEmail, validatePasswordStrength } from './base';

export const loginUserSchema = z.object({
    email: z.string(),
    password: z.string(),
}).superRefine((data, ctx) => {
    const { email, password } = data;

    // validate email format
    validateEmail(email, ctx);

    // validate password strength
    validatePasswordStrength(password, ctx);

});


export type LoginUserInputs = z.infer<typeof loginUserSchema>;
