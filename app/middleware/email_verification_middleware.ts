// app/middleware/email_verification_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EmailVerificationMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      const user = await auth.authenticate()

      if (!user.isEmailVerified) {
        return response.forbidden({ 
          message: 'Email not verified. Please verify your email first.' 
        })
      }

      await next()
    } catch (error) {
      return response.unauthorized({ 
        message: 'Authentication failed' 
      })
    }
  }
}