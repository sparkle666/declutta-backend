import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import CartItem from '#models/cart_item'

export default class CartsController {
  /**
   * GET /api/cart
   * Get the current user's cart and items
   */
  public async show({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    let cart = await Cart.query().where('user_id', user.id).preload('items', (query) => query.preload('product')).first()
    if (!cart) {
      cart = await Cart.create({ userId: user.id })
    }
    await cart.load('items', (query) => query.preload('product'))
    return response.ok(cart)
  }

  /**
   * POST /api/cart/items
   * Add a product to the cart (or update quantity if already present)
   * Body: { productId: number, quantity: number }
   */
  public async addItem({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const { productId, quantity } = request.only(['productId', 'quantity'])
    let cart = await Cart.query().where('user_id', user.id).first()
    if (!cart) {
      cart = await Cart.create({ userId: user.id })
    }
    let item = await CartItem.query().where('cart_id', cart.id).andWhere('product_id', productId).first()
    if (item) {
      item.quantity += quantity || 1
      await item.save()
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity: quantity || 1 })
    }
    await cart.load('items', (query) => query.preload('product'))
    return response.ok(cart)
  }

  /**
   * PUT /api/cart/items/:id
   * Update the quantity of a cart item
   * Body: { quantity: number }
   */
  public async updateItem({ auth, params, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const { quantity } = request.only(['quantity'])
    const item = await CartItem.query().where('id', params.id).first()
    if (!item) {
      return response.notFound({ message: 'Cart item not found' })
    }
    item.quantity = quantity
    await item.save()
    return response.ok(item)
  }

  /**
   * DELETE /api/cart/items/:id
   * Remove an item from the cart
   */
  public async removeItem({ auth, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const item = await CartItem.query().where('id', params.id).first()
    if (!item) {
      return response.notFound({ message: 'Cart item not found' })
    }
    await item.delete()
    return response.noContent()
  }

  /**
   * DELETE /api/cart
   * Clear the cart
   */
  public async clear({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    let cart = await Cart.query().where('user_id', user.id).first()
    if (cart) {
      await CartItem.query().where('cart_id', cart.id).delete()
    }
    return response.noContent()
  }
}
