import { Exception } from '@adonisjs/core/exceptions'

export default class UnauthorizedErrorException extends Exception {
  /**
   * Handle the exception and format the response.
   */
  public async handle({ response }: any) {
    return response.unauthorized({
      status: 'error',
      message: 'You must be logged in to access this resource.',
      code: 'UNAUTHORIZED'
    })
  }
}
