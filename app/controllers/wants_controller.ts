// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { wantValidator } from '#validators/WantValidator'
import Want from '#models/want'

export default class WantsController {
  public async index({ response, auth }: HttpContext) {
    const user = auth.user!
    const wants = await Want.query().where('userId', user.id)
    return response.json(wants)
  }

  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(wantValidator)
    const user = auth.user!
    const want = await Want.create({ ...data, userId: user.id })
    return response.created(want)
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