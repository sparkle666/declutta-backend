/**
 * ShippingAddressesController handles CRUD operations for user shipping addresses.
 *
 * - All endpoints require authentication.
 * - Each user can have multiple shipping addresses, but only one can be default.
 * - All operations are scoped to the authenticated user.
 *
 * Endpoints:
 *   GET    /api/shipping-addresses           - List all shipping addresses for the user
 *   POST   /api/shipping-addresses           - Create a new shipping address
 *   GET    /api/shipping-addresses/:id       - Get a single shipping address by ID
 *   PUT    /api/shipping-addresses/:id       - Update a shipping address by ID
 *   DELETE /api/shipping-addresses/:id       - Delete a shipping address by ID
 *
 * Request body for create/update:
 *   {
 *     address: string,         // Required, min 5 chars
 *     postalCode: string,      // Required, min 3 chars
 *     isDefault?: boolean      // Optional, set as default address
 *   }
 *
 * Responses:
 *   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
 */

import type { HttpContext } from '@adonisjs/core/http'
import ShippingAddress from '#models/shipping_address'
import { shippingAddressValidator } from '#validators/ShippingAddressValidator'

export default class ShippingAddressesController {
  // List all shipping addresses for the authenticated user
  public async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const addresses = await ShippingAddress.query().where('userId', userId)
    return response.json(addresses)
  }

  // Create a new shipping address
  public async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(shippingAddressValidator)
    // If isDefault is true, unset other default addresses
    if (data.isDefault) {
      await ShippingAddress.query().where('userId', userId).update({ isDefault: false })
    }
    const address = await ShippingAddress.create({ ...data, userId })
    return response.created(address)
  }

  // Show a single shipping address (must belong to user)
  public async show({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const address = await ShippingAddress.query().where('id', params.id).where('userId', userId).first()
    if (!address) {
      return response.notFound({ message: 'Shipping address not found.' })
    }
    return response.json(address)
  }

  // Update a shipping address (must belong to user)
  public async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id
    const address = await ShippingAddress.query().where('id', params.id).where('userId', userId).first()
    if (!address) {
      return response.notFound({ message: 'Shipping address not found.' })
    }
    const data = await request.validateUsing(shippingAddressValidator)
    // If isDefault is true, unset other default addresses
    if (data.isDefault) {
      await ShippingAddress.query().where('userId', userId).update({ isDefault: false })
    }
    address.merge(data)
    await address.save()
    return response.json(address)
  }

  // Delete a shipping address (must belong to user)
  public async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const address = await ShippingAddress.query().where('id', params.id).where('userId', userId).first()
    if (!address) {
      return response.notFound({ message: 'Shipping address not found.' })
    }
    await address.delete()
    return response.ok({ message: 'Shipping address deleted.' })
  }
}
