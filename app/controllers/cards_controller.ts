/**
 * CardsController handles CRUD operations for user payment cards.
 *
 * - All endpoints require authentication.
 * - Each user can have multiple cards, but only one can be default.
 * - CVV is never stored or accepted by the API.
 * - All operations are scoped to the authenticated user.
 *
 * Endpoints:
 *   GET    /api/cards           - List all cards for the user
 *   POST   /api/cards           - Create a new card
 *   GET    /api/cards/:id       - Get a single card by ID
 *   PUT    /api/cards/:id       - Update a card by ID
 *   DELETE /api/cards/:id       - Delete a card by ID
 *
 * Request body for create/update:
 *   {
 *     cardNumber: string,      // Required, 12-19 digits
 *     cardHolderName: string,  // Required, min 2 chars
 *     bankName: string,        // Required, min 2 chars
 *     expirationDate: string,  // Required, MM/YY
 *     isDefault?: boolean      // Optional, set as default card
 *   }
 *
 * Responses:
 *   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
 */

import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import { cardValidator } from '#validators/CardValidator'

export default class CardsController {
  // List all cards for the authenticated user

    /**
   * @swagger
   * /cards:
   *   get:
   *     summary: List all cards for the authenticated user
   *     responses:
   *       200:
   *         description: A list of cards.
   */
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

   /**
   * @swagger
   * /cards/{id}:
   *   delete:
   *     summary: Delete a card (must belong to user)
   *     description: Deletes a card owned by the authenticated user.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the card to delete.
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Card deleted successfully.
   *         content:
   *           application/json:
   *             example:
   *               message: "Card deleted."
   *       401:
   *         description: Unauthorized - User is not authenticated.
   *       403:
   *         description: Forbidden - User does not own the card.
   *       404:
   *         description: Card not found.
   */
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
