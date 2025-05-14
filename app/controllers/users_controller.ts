// app/controllers/UsersController.ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'



export default class UsersController {
    // Get all users with related products and images
    public async index({ response }: HttpContext) {
      try {
        const users = await User.query()
          .select('id', 'fullName', 'firstName', 'lastName', 'email', 'isEmailVerified', 'createdAt')
          .preload('products', (productQuery) => {
            productQuery.select('id', 'productName', 'productPrice', 'productLocation')
          })
          .preload('products', (productQuery) => {
            productQuery
              .select('id', 'productName', 'productPrice', 'productLocation')
              .preload('images', (imageQuery) => {
                imageQuery.select('id', 'imageUrl')
              })
          })
  
        return response.json(users)
      } catch (error) {
        return response.status(500).json({
          status: 'error',
          message: 'Failed to retrieve users.',
          error: error.message
        })
      }
    }
  }
