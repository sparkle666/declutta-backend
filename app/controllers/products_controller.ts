// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { productValidator } from '#validators/ProductValidator'
import Product from '#models/product'
// import UnauthorizedErrorException from '#exceptions/unauthorized_error_exception'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    const products = await Product.query().preload('category').preload('reviews').preload('images')
    return response.json(products)
  }

  public async store({ request, response }: HttpContext) {
    // const user = auth.user
    // if (!user) {
    //   return response.unauthorized({
    //     status: 'error',
    //     message: 'You must be logged in to access this resource.',
    //     code: 'UNAUTHORIZED'
    //   })
    // }
  
    const data = await request.validateUsing(productValidator)
  
    // Create the product
    const product = await Product.create({ ...data, listedBy: 1 })
  
    // Handle images manually
    const images = request.files('images', {
      size: '5mb', // Maximum file size (adjust as needed)
      extnames: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file types
    })
  
    if (images) {
      for (const image of images) {
        await image.move('./uploads/products') // Save image manually in a local folder
  
        // Save image details in database
        await product.related('images').create({
          imageUrl: `/public/products/${image.fileName}`,
        })
      }
    }
    
      // Reload the product with images relationship
    await product.load('images')


    return response.created({
      status: 'success',
      message: 'Product created successfully with images',
      product,
    })
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