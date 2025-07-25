
import type { HttpContext } from '@adonisjs/core/http'
import { imageValidator } from '#validators/ImageValidator'
import Image from '#models/image'
import { put } from '@vercel/blob'

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
  // Secure image upload endpoint for frontend
  public async uploadImage({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ status: 'error', message: 'Unauthorized' })
    }
    const image = request.file('image', {
      size: '4.5mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
    })
    if (!image) {
      return response.badRequest({ status: 'error', message: 'No image provided' })
    }
    const fs = await import('node:fs/promises')
    await image.move('./tmp')
    const fileBuffer = await fs.readFile(image.filePath!)
    const { url } = await put(`product/${image.fileName}`, fileBuffer, {
      access: 'public',
      contentType: image.type + '/' + image.subtype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    })
    await fs.unlink(image.filePath!)
    return response.json({ status: 'success', url })
  }


    // Secure multiple image upload endpoint for frontend
  public async uploadImages({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ status: 'error', message: 'Unauthorized' })
    }
    const images = request.files('images', {
      size: '4.5mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
    })
    if (!images || images.length === 0) {
      return response.badRequest({ status: 'error', message: 'No images provided' })
    }
    const fs = await import('node:fs/promises')
    const urls: string[] = []
    for (const image of images) {
      await image.move('./tmp')
      const fileBuffer = await fs.readFile(image.filePath!)
      const { url } = await put(`product/${image.fileName}`, fileBuffer, {
        access: 'public',
        contentType: image.type + '/' + image.subtype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      })
      await fs.unlink(image.filePath!)
      urls.push(url)
    }
    return response.json({ status: 'success', urls })
  }
}