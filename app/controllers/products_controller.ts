
// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { productValidator } from '#validators/ProductValidator'
import Product from '#models/product'
import { put } from '@vercel/blob'

import { readFile } from 'node:fs/promises'

// import UnauthorizedErrorException from '#exceptions/unauthorized_error_exception'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    const products = await Product.query().preload('category').preload('reviews').preload('images')
    return response.json(products)
  }

  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({
        status: 'error',
        message: 'You must be logged in to access this resource.',
        code: 'UNAUTHORIZED'
      })
    }
  
    const data = await request.validateUsing(productValidator)
  
    // Create the product
    const product = await Product.create({ ...data, listedBy: user.id })
  
    // Handle images manually
    const images = request.files('images', {
      size: '5mb', // Maximum file size (adjust as needed)
      extnames: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file types
    })

    if (!images || images.length === 0) {
      return response.badRequest({
        status: 'error',
        message: 'At least one image is required to create a product.'
      })
    }

    const uploadedImageUrls: string[] = []
    const fs = await import('node:fs/promises')
    try {
      for (const image of images) {
        // Move the file to a temporary location first
        await image.move('./tmp')
        // Read the file as buffer
        const fileBuffer = await readFile(image.filePath!)
        // Upload to Vercel Blob using buffer
        const { url } = await put(`product/${image.fileName}`, fileBuffer, {
          access: 'public',
          contentType: image.type + '/' + image.subtype,
          token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
          addRandomSuffix: true,
        })
        // Save image details in database
        await product.related('images').create({
          imageUrl: url,
        })
        uploadedImageUrls.push(url)
        // Clean up the tmp file
        await fs.unlink(image.filePath!)
      }
    } catch (error) {
      // Clean up any tmp files that may still exist
      for (const image of images) {
        try { await fs.unlink(image.filePath!) } catch {}
      }
      // Delete the product if it was created but images failed
      await product.delete()
      return response.internalServerError({
        status: 'error',
        message: 'Image upload failed. Product was not created.',
        error: error.message || error.toString(),
      })
    }
    
      // Reload the product with images relationship
    await product.load('images')


    return response.created({
      status: 'success',
      message: 'Product created successfully with images',
      product,
    })
  }


  // In ProductsController.ts

  public async storeV2({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({
        status: 'error',
        message: 'You must be logged in to access this resource.',
        code: 'UNAUTHORIZED'
      })
    }

    // Accept imageUrls as an array of strings in the request body
    const data = await request.validateUsing(productValidator)
    const imageUrls: string[] = request.input('imageUrls', [])

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return response.badRequest({
        status: 'error',
        message: 'At least one image URL is required to create a product.'
      })
    }

    // Create the product
    const product = await Product.create({ ...data, listedBy: user.id })

    // Save image URLs in the database
    for (const url of imageUrls) {
      await product.related('images').create({ imageUrl: url })
    }

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
    // Ensure only 'new' or 'used' is accepted for condition (already validated)
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