import { z } from 'zod'

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

// Account schemas
export const createAccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['CHECKING', 'SAVINGS']).optional(),
  currency: z.string().length(3).optional()
})

// Transaction schemas
export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  debitAccountId: z.string(),
  creditAccountId: z.string()
})

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>