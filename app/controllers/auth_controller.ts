// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { 
  signupValidator, 
  loginValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator, 
  emailVerificationValidator
} from '#validators/auth'
import mail from '@adonisjs/mail/services/main'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

import { inject } from '@adonisjs/core'


@inject()
export default class AuthController {

   /**
   * Signup a new user with email verification
   */
   async signup({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    try {
      const user = await User.create({
        email: payload.email,
        password: payload.password,
        fullName: payload.fullName,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isEmailVerified: false
      })

      // Generate 4-digit verification code
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Store verification code with expiration (1 hour from now)
      user.emailVerificationCode = verificationCode
      user.emailVerificationCodeExpires = DateTime.now().plus({ hours: 1 })
      await user.save()

      // Send verification email
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Email Verification Code')
          .html(`
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 1 hour.</p>
          `)
      })

      return response.created({ 
        message: 'User created. Please check your email for verification code.',
        userId: user.id
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Error creating user', 
        error: error.message 
      })
    }
  }

  /**
   * Verify email with 4-digit code
   */
  async verifyEmail({ request, response }: HttpContext) {
    const { email, code } = await request.validateUsing(emailVerificationValidator)

    try {
      const user = await User.query()
        .where('email', email)
        .where('email_verification_code', code)
        .where('email_verification_code_expires', '>', new Date())
        .first()

      if (!user) {
        return response.badRequest({ 
          message: 'Invalid or expired verification code' 
        })
      }

      if (user.isEmailVerified) {
        return response.badRequest({ 
          message: 'Email already verified' 
        })
      }

      // Mark email as verified
      user.isEmailVerified = true
      user.emailVerificationCode = null
      user.emailVerificationCodeExpires = null
      await user.save()

      return response.ok({ 
        message: 'Email verified successfully' 
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Error verifying email', 
        error: error.message 
      })
    }
  }

  /**
   * Login user with email verification check
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      // Check if email is verified
      if (!user.isEmailVerified) {
        return response.forbidden({ 
          message: 'Please verify your email first' 
        })
      }

      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.toJSON(),
        user: user.serialize()
      })
    } catch (error) {
      return response.unauthorized({ 
        message: 'Invalid credentials' 
      })
    }
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(
      vine.compile(vine.object({ email: vine.string().email() }))
    )

    try {
      const user = await User.findBy('email', email)

      if (!user) {
        return response.notFound({ 
          message: 'User not found' 
        })
      }

      if (user.isEmailVerified) {
        return response.badRequest({ 
          message: 'Email already verified' 
        })
      }

      // Generate new 4-digit verification code
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Update verification code
      user.emailVerificationCode = verificationCode
      user.emailVerificationCodeExpires = DateTime.now().plus({ hours: 1 })
      await user.save()

      // Send new verification email
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Email Verification Code')
          .html(`
            <h1>Email Verification</h1>
            <p>Your new verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 1 hour.</p>
          `)
      })

      return response.ok({ 
        message: 'New verification code sent to your email' 
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Error resending verification code', 
        error: error.message 
      })
    }
  }

  /**
   * Signup a new user
   */
  // async signup({ request, response }: HttpContext) {
  //   const payload = await request.validateUsing(signupValidator)

  //   try {
  //     const user = await User.create({
  //       email: payload.email,
  //       password: payload.password,
  //       fullName: payload.fullName,
  //       firstName: payload.firstName,
  //       lastName: payload.lastName
  //     })

  //     return response.created({ 
  //       message: 'User created successfully', 
  //       user: user.serialize() 
  //     })
  //   } catch (error) {
  //     return response.badRequest({ 
  //       message: 'Error creating user', 
  //       error: error.message 
  //     })
  //   }
  // }

  // /**
  //  * Login user and generate JWT token
  //  */
  // async login({ request, response }: HttpContext) {
  //   const { email, password } = await request.validateUsing(loginValidator)

  //   try {
  //     const user = await User.verifyCredentials(email, password)
  //     const token = await User.accessTokens.create(user)

  //     return response.ok({
  //       token: token.toJSON(),
  //       user: user.serialize()
  //     })
  //   } catch (error) {
  //     return response.unauthorized({ 
  //       message: 'Invalid credentials' 
  //     })
  //   }
  // }

  /**
   * Initiate forgot password process
   */
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    try {
      const user = await User.findBy('email', email)


      if (!user) {
        return response.notFound({ 
          message: 'User not found' 
        })
      }

      // Generate a reset token
      const resetToken = randomBytes(32).toString('hex')

      
      // Store the token with expiration (1 hour from now)
      user.resetPasswordToken = resetToken
      user.resetPasswordExpires = DateTime.now().plus({ hours: 1 })
      await user.save()

      // Send reset password email
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Password Reset Request')
          .html(`
            <h1>Password Reset</h1>
            <p>Click the link below to reset your password:</p>
            <a href="http://your-frontend-url/reset-password?token=${resetToken}">
              Reset Password:
            </a>
            <p>This link will expire in 1 hour: ${resetToken}</p>
          `)
      })


      return response.ok({ 
        message: 'Password reset link sent to your email' 
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Error processing password reset', 
        error: error.message 
      })
    }
  }

  /**
   * Reset password
   */
  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    try {
      const user = await User.query()
        .where('reset_password_token', token)
        .where('reset_password_expires', '>', new Date())
        .first()

      if (!user) {
        return response.badRequest({ 
          message: 'Invalid or expired reset token' 
        })
      }

      // Update password
      user.password = password
      user.resetPasswordToken = null
      user.resetPasswordExpires = null
      await user.save()

      return response.ok({ 
        message: 'Password reset successfully' 
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Error resetting password', 
        error: error.message 
      })
    }
  }

  /**
   * Logout user (invalidate token)
   */
//   async logout({ auth, response }: HttpContext) {
//     await auth.use('access_tokens').revoke()
//     return response.ok({ 
//       message: 'Logged out successfully' 
//     })
//   }
}