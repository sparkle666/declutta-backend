// app/validators/auth.ts
import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
    fullName: vine.string().optional(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional()
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(8).maxLength(32)
  })
)

export const emailVerificationValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    code: vine.string().fixedLength(4)
  })
)