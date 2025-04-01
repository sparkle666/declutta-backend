import type { HttpContext } from '@adonisjs/core/http'
import { reviewValidator } from '#validators/ReviewValidator'
import Review from '#models/review'

export default class ReviewsController {
  public async index({ response }: HttpContext) {
    const reviews = await Review.query().preload('product').preload('user')
    return response.json(reviews)
  }

  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(reviewValidator)
    const user = auth.user!
    const review = await Review.create({ ...data, userId: user.id })
    return response.created(review)
  }

  public async show({ params, response }: HttpContext) {
    const review = await Review.query()
      .where('id', params.id)
      .preload('product')
      .preload('user')
      .firstOrFail()
    return response.json(review)
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(reviewValidator)
    const user = auth.user!
    const review = await Review.findOrFail(params.id)
    if (review.userId !== user.id) return response.forbidden('You can only edit your own reviews')
    review.merge(data)
    await review.save()
    return response.json(review)
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const review = await Review.findOrFail(params.id)
    if (review.userId !== user.id) return response.forbidden('You can only delete your own reviews')
    await review.delete()
    return response.noContent()
  }
}