/**
 * WantsController handles CRUD operations for user wants (wish list items).
 *
 * - All endpoints require authentication.
 * - Each user can have multiple wants.
 * - All operations are scoped to the authenticated user.
 *
 * Endpoints:
 *   GET    /api/wants           - List all wants for the user
 *   POST   /api/wants           - Create a new want
 *   GET    /api/wants/:id       - Get a single want by ID
 *   PUT    /api/wants/:id       - Update a want by ID
 *   DELETE /api/wants/:id       - Delete a want by ID
 *
 * Request body for create/update:
 *   {
 *     name: string,         // Required, name of the want
 *     keywords: string[],   // Required, array of keywords
 *   }
 *
 * Responses:
 *   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
 */

import type { HttpContext } from '@adonisjs/core/http'
import { wantValidator } from '#validators/WantValidator'
import Want from '#models/want'

export default class WantsController {
  public async index({ response, auth }: HttpContext) {
    const user = auth.user!
    const wants = await Want.query().where('userId', user.id)
    return response.json(wants)
  }

  // public async store({ request, response, auth }: HttpContext) {
  //   const data = await request.validateUsing(wantValidator)
  //   const user = auth.user!
  //   const want = await Want.create({ ...data, userId: user.id })
  //   return response.created(want)
  // }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(wantValidator)
      const user = auth.user!
      const want = await Want.create({ ...data, userId: user.id })
      return response.created(want)
    } catch (error) {
      return response.status(400).json({ message: 'Failed to create want', error: error.message })
    }
  }

  public async show({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const want = await Want.query().where('id', params.id).where('userId', user.id).firstOrFail()
    return response.json(want)
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(wantValidator)
    const user = auth.user!
    const want = await Want.query().where('id', params.id).where('userId', user.id).firstOrFail()
    want.merge(data)
    await want.save()
    return response.json(want)
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const want = await Want.query().where('id', params.id).where('userId', user.id).firstOrFail()
    await want.delete()
    return response.noContent()
  }
}