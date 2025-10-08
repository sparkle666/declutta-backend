import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // Handle validation errors
    if (error && typeof error === 'object' && 'code' in error) {
      // @ts-ignore
      if (error.code === 'E_VALIDATION_FAILURE') {
        // @ts-ignore
        return ctx.response.status(422).send({
          message: ((error as unknown) as { message: string }).message,
          errors: ((error as unknown) as { messages: any }).messages,
        })
      }
      // @ts-ignore
      if (error.code === 'E_ROW_NOT_FOUND') {
        return ctx.response.status(404).send({
          message: 'Resource not found',
        })
      }
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
