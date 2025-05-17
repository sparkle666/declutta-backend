import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import { cardValidator } from '#validators/CardValidator'

export default class CardsController {
  // List all cards for the authenticated user
  public async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const cards = await Card.query().where('userId', userId)
    return response.json(cards)
  }

  // Create a new card
  public async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(cardValidator)
    // Prevent duplicate card number for the same user
    const exists = await Card.query().where('userId', userId).where('cardNumber', data.cardNumber).first()
    if (exists) {
      return response.badRequest({ message: 'Card number already exists for this user.' })
    }
    // If isDefault is true, unset other default cards
    if (data.isDefault) {
      await Card.query().where('userId', userId).update({ isDefault: false })
    }
    const card = await Card.create({ ...data, userId })
    return response.created(card)
  }

  // Show a single card (must belong to user)
  public async show({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const card = await Card.query().where('id', params.id).where('userId', userId).first()
    if (!card) {
      return response.notFound({ message: 'Card not found.' })
    }
    return response.json(card)
  }

  // Update a card (must belong to user)
  public async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id
    const card = await Card.query().where('id', params.id).where('userId', userId).first()
    if (!card) {
      return response.notFound({ message: 'Card not found.' })
    }
    const data = await request.validateUsing(cardValidator)
    // Prevent duplicate card number for the same user (if changed)
    if (data.cardNumber && data.cardNumber !== card.cardNumber) {
      const exists = await Card.query().where('userId', userId).where('cardNumber', data.cardNumber).first()
      if (exists) {
        return response.badRequest({ message: 'Card number already exists for this user.' })
      }
    }
    // If isDefault is true, unset other default cards
    if (data.isDefault) {
      await Card.query().where('userId', userId).update({ isDefault: false })
    }
    card.merge(data)
    await card.save()
    return response.json(card)
  }

  // Delete a card (must belong to user)
  public async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const card = await Card.query().where('id', params.id).where('userId', userId).first()
    if (!card) {
      return response.notFound({ message: 'Card not found.' })
    }
    await card.delete()
    return response.ok({ message: 'Card deleted.' })
  }
}
