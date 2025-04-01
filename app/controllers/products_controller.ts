// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { productValidator } from '#validators/ProductValidator'
import Product from '#models/product'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    const products = await Product.query().preload('category').preload('reviews').preload('images')
    return response.json(products)
  }

  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(productValidator)
    const user = auth.user!
    const product = await Product.create({ ...data, listedBy: user.id })
    return response.created(product)
  }

  public async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .preload('reviews')
      .preload('images')
      .firstOrFail()
    return response.json(product)
  }

  public async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(productValidator)
    const product = await Product.findOrFail(params.id)
    product.merge(data)
    await product.save()
    return response.json(product)
  }

  public async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }
}