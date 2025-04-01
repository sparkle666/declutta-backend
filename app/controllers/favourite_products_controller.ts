import type { HttpContext } from '@adonisjs/core/http'
import { favouriteProductValidator } from '#validators/FavouriteProductValidator'

export default class FavouriteProductsController {
  public async index({ response, auth }: HttpContext) {
    const user = auth.user!
    await user.preload('favourites')
    return response.json(user.favourites)
  }

  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(favouriteProductValidator)
    const user = auth.user!
    await user.related('favourites').attach([data.productId])
    return response.created({ message: 'Product favourited' })
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    await user.related('favourites').detach([params.id])
    return response.noContent()
  }
}