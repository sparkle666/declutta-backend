import type { HttpContext } from '@adonisjs/core/http'
import { imageValidator } from '#validators/ImageValidator'
import Image from '#models/image'

export default class ImagesController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(imageValidator)
    const image = await Image.create(data)
    return response.created(image)
  }

  public async destroy({ params, response }: HttpContext) {
    const image = await Image.findOrFail(params.id)
    await image.delete()
    return response.noContent()
  }
}