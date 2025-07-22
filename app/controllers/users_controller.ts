// app/controllers/UsersController.ts
import User from '#models/user'
import { put } from '@vercel/blob'
import { HttpContext } from '@adonisjs/core/http'



export default class UsersController {
    // Get all users with related products and images
    public async index({ response }: HttpContext) {
      try {
        const users = await User.query()
        .select('id', 'fullName', 'firstName', 'lastName', 'email', 
            'bio',
            'gender',
            'dateOfBirth',
            'phoneNumber',
            'isEmailVerified',
            'createdAt')
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
          // Do not allow email and role to be updated for security/auth reasons
          const data = request.only([
            'fullName',
            'firstName',
            'lastName',
            'bio',
            'gender',
            'dateOfBirth',
            'phoneNumber',
            'profilePicture'
          ])

          // Handle profile picture upload if file is present
          const profilePictureFile = request.file('profilePicture')
          let profilePictureUrl = null
          if (profilePictureFile) {
            // Read file buffer from tmpPath
            const fs = await import('fs/promises')
            const fileBuffer = await fs.readFile(profilePictureFile.tmpPath!)
            const now = new Date()
            const dateStr = now.toISOString().split('T')[0]
            const blobName = `profile-pictures/user-${userId}-${dateStr}-${profilePictureFile.clientName}`
            const result = await put(blobName, fileBuffer, {
              access: 'public',
              token: process.env.BLOB_READ_WRITE_TOKEN,
              addRandomSuffix: true,
            })
            profilePictureUrl = result.url
            data.profilePicture = profilePictureUrl
          }

          const user = await User.findOrFail(userId)
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
            .select(
              'id',
              'fullName',
              'firstName',
              'lastName',
              'email',
              'bio',
              'gender',
              'dateOfBirth',
              'phoneNumber',
              'profilePicture',
              'role',
              'isEmailVerified',
              'createdAt',
              'updatedAt'
            )
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
      
      public async delete({ auth, params, response }: HttpContext) {
        try {
          // Check if the authenticated user is admin
          const currentUser = auth.user
          if (!currentUser || currentUser.role !== 'admin') {
            return response.forbidden({
              status: 'error',
              message: 'Only admins can delete users.'
            })
          }

          const user = await User.find(params.id)
          if (!user) {
            return response.status(404).json({
              status: 'error',
              message: 'User not found.'
            })
          }
          await user.delete()
          return response.json({
            status: 'success',
            message: 'User deleted successfully.'
          })
        } catch (error) {
          return response.status(500).json({
            status: 'error',
            message: 'Failed to delete user.',
            error: error.message
          })
        }
      }
  }
