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

    public async update({ request, response, params }: HttpContext) {
        try {
          const userId = params.id
          const data = request.only(['fullName', 'firstName', 'lastName', 'email', 'role'])
    
          const user = await User.findOrFail(userId)
    
          // ✅ Only update fields that are provided
          user.merge(data)
          await user.save()
    
          return response.json({
            status: 'success',
            message: 'User updated successfully.',
            user
          })
        } catch (error) {
          return response.status(500).json({
            status: 'error',
            message: 'Failed to update user.',
            error: error.message
          })
        }
      }


      public async getUserById({ params, response }: HttpContext) {
        try {
          const user = await User.query()
            .select('id', 'fullName', 'firstName', 'lastName', 'email', 'isEmailVerified', 'createdAt')
            .where('id', params.id)
            .first()
      
          if (!user) {
            return response.status(404).json({
              status: 'error',
              message: 'User not found.',
            })
          }
      
          return response.json(user)
        } catch (error) {
          return response.status(500).json({
            status: 'error',
            message: 'Failed to retrieve user.',
            error: error.message
          })
        }
      }
      
      
  }
