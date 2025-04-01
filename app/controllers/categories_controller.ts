// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { categoryValidator } from '#validators/CategoryValidator'
import Category from '#models/category'

export default class CategoriesController {
  public async index({ response }: HttpContext) {
    const categories = await Category.all()
    return response.json(categories)
  }

  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(categoryValidator)
    const category = await Category.create({ ...data })
    return response.created(category)
  }

  public async show({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return response.json(category)
  }

  public async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(categoryValidator)
    const category = await Category.findOrFail(params.id)
    category.merge(data)
    await category.save()
    return response.json(category)
  }

  public async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}