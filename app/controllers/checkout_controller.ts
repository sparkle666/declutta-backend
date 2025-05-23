import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import Env from '@adonisjs/core/env'
import axios from 'axios'

export default class CheckoutController {
  /**
   * POST /api/checkout
   * Receives cart, creates order, initiates Paystack payment, returns payment URL
   */
  public async checkout({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { items } = request.only(['items']) // [{ productId, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return response.badRequest({ message: 'Cart is empty.' })
    }

    // Validate products and calculate total
    let total = 0
    const orderItems: any[] = []
    for (const item of items) {
      const product = await Product.find(item.productId)
      if (!product) {
        return response.badRequest({ message: `Product ${item.productId} not found.` })
      }
      const price = product.productPrice
      total += price * item.quantity
      orderItems.push({ productId: product.id, quantity: item.quantity, price })
    }

    // Create order and order items
    const order = await Order.create({
      userId: user.id,
      status: 'pending',
      total,
    })
    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id })
    }

    // Initiate Paystack transaction
    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: Math.round(total * 100), // Paystack expects amount in kobo
        reference: `order_${order.id}_${Date.now()}`,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // reference
    order.paystackRef = paystackRes.data.data.reference
    await order.save()

    return response.ok({
      paymentUrl: paystackRes.data.data.authorization_url,
      orderId: order.id,
    })
  }

  /**
   * POST /api/paystack/webhook
   * Paystack webhook for payment verification
   */
  public async paystackWebhook({ request, response }: HttpContext) {
    const event = request.input('event')
    const data = request.input('data')
    if (event === 'charge.success') {
      const order = await Order.query().where('paystack_ref', data.reference).first()
      if (order && order.status !== 'paid') {
        order.status = 'paid'
        await order.save()
        // TODO: Fulfill order, send email, etc.
      }
    }
    return response.ok({ received: true })
  }

  /**
   * GET /api/orders/:id
   * Get order details
   */
  public async show({ auth, params, response }: HttpContext) {
    const order = await Order.query().where('id', params.id).where('user_id', auth.user!.id).preload('items').first()
    if (!order) return response.notFound({ message: 'Order not found.' })
    return response.ok(order)
  }
}
