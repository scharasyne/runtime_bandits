import { z } from 'zod'

// Common email validation
const emailSchema = z
  .string()
  .min(1, 'Email ay kinakailangan')
  .email('Hindi wastong email format')

// Password validation with Filipino-friendly messages
const passwordSchema = z
  .string()
  .min(8, 'Password ay dapat may hindi bababa sa 8 character')
  .regex(/[A-Z]/, 'Password ay dapat may malaking titik')
  .regex(/[a-z]/, 'Password ay dapat may maliit na titik')
  .regex(/[0-9]/, 'Password ay dapat may numero')
  .regex(/[^A-Za-z0-9]/, 'Password ay dapat may special character')

// Phone number validation (Philippine format)
const phoneSchema = z
  .string()
  .regex(
    /^(\+63|63|0)?[0-9]{10}$/,
    'Hindi wastong phone number format (hal: 09123456789 o +639123456789)'
  )
  .optional()
  .or(z.literal(''))

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Pangalan ay dapat may hindi bababa sa 2 character')
  .max(50, 'Pangalan ay hindi dapat lumampas sa 50 character')
  .regex(/^[a-zA-Z\s\-\.\']*$/, 'Pangalan ay pwedeng may titik, space, at gitling lamang')

// Business name validation
const businessNameSchema = z
  .string()
  .min(2, 'Business name ay dapat may hindi bababa sa 2 character')
  .max(100, 'Business name ay hindi dapat lumampas sa 100 character')
  .optional()
  .or(z.literal(''))

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password ay kinakailangan'),
})

// Registration form schema
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Pakiulit ang password'),
    firstName: nameSchema,
    lastName: nameSchema,
    businessName: businessNameSchema,
    phone: phoneSchema,
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'Dapat ay sumang-ayon sa mga terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mga password ay hindi magkatugma',
    path: ['confirmPassword'],
  })

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Pakiulit ang password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mga password ay hindi magkatugma',
    path: ['confirmPassword'],
  })

// Profile update schema
export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  businessName: businessNameSchema,
  phone: phoneSchema,
})

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Kasalukuyang password ay kinakailangan'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Pakiulit ang bagong password'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Mga bagong password ay hindi magkatugma',
    path: ['confirmNewPassword'],
  })

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema> 