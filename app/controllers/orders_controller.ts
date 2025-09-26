import axios from 'axios'
import { orderValidator } from '../validators/OrderValidator.js'

import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import Product from '#models/product'
import OrderItem from '#models/order_item'

export default class OrdersController {
  // Get individual order by ID
  public async show({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const order = await Order.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('orderItems', (query) => query.preload('product'))
      .first()
    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }
    return response.json(order)
  }
  // Update order details
  public async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(orderValidator)
    const order = await Order.findOrFail(params.id)
    order.merge(data)
    await order.save()
    await order.load('orderItems')
    return response.ok(order)
  }
  // Helper to verify Paystack payment
  public async verifyPaystackReference(reference: string): Promise<{ success: boolean, data?: any, error?: string }> {
    if (!reference) {
      return { success: false, error: 'Reference is required' }
    }
    try {
      const paystackRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
          },
        }
      )
      const data = paystackRes.data
      if (data.status && data.data.status === 'success') {
        return { success: true, data: data.data }
      } else {
        return { success: false, data: data.data }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
  // ...existing code...
  // Verify Paystack payment by reference
  public async verifyPaystack({ request, response }: HttpContext) {
    // Verify payment by reference and update order if found
    
    const reference = request.input('reference')
    if (!reference) {
      return response.badRequest({ message: 'Reference is required' })
    }
    try {
      const paystackRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
          },
        }
      )
      const data = paystackRes.data
      if (data.status && data.data.status === 'success') {
          // Find and update the order with this reference
          const order = await Order.findBy('paystackRef', reference)
          if (order) {
            order.paymentStatus = 'paid'
            order.transaction = data.data.id?.toString() || order.transaction
            await order.save()
          }
          return response.ok({ verified: true, data: data.data, order })
      } else {
        return response.ok({ verified: false, data: data.data })
      }
    } catch (error) {
      return response.status(500).json({ message: 'Verification failed', error: error.message })
    }
  }

  // List all orders for the authenticated user
  public async index({ auth, response }: HttpContext) {
  const user = auth.user!
  const orders = await Order
  .query()
  .where('userId', user.id)
  .preload('orderItems', (query) => query.preload('product'))

  return response.json(orders)
  }

  // Create a new order (buy a product)
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const products = request.input('products') // Array of { productId, quantity }
    if (!Array.isArray(products) || products.length === 0) {
      return response.badRequest({ message: 'No products provided' })
    }

    // Paystack payment info
    const paystackRef = request.input('reference') || request.input('trxref')
    const paystackTransaction = request.input('transaction') || request.input('trans')


    // Create order
      const order = await Order.create({
        userId: user.id,
        orderStatus: 'pending',
        paymentStatus: paystackRef ? 'pending' : 'failed',
        paystackRef: paystackRef,
        transaction: paystackTransaction,
      })
    // For each product, create order item and mark product as sold
    for (const item of products) {
      const product = await Product.findOrFail(item.productId)
      if (product.isSold) {
        return response.badRequest({ message: `Product ${product.id} already sold` })
      }
      product.isSold = true
      product.buyerId = user.id
      await product.save()
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        price: product.productPrice,
        quantity: item.quantity || 1,
      })
    }
  await order.load('orderItems')
  return response.created(order)
  }
}
