import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class EnsureUserOrAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */

    // Ensure the user is authenticated
    const user = ctx.auth.user

    // Ensure the user exists (if not authenticated)
    if (!user) {
      return ctx.response.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      })
    }

    // Get the requested user ID (from params)
    const userIdFromParams = ctx.params.id

    // Check if the user is trying to update their own details or if they are an admin
    if (user.id !== parseInt(userIdFromParams) && user.role !== 'admin') {
      return ctx.response.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this user.',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
