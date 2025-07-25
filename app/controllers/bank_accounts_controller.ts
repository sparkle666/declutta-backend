/**
 * BankAccountsController handles CRUD operations for user bank accounts.
 *
 * - All endpoints require authentication.
 * - Each user can have multiple bank accounts.
 * - All operations are scoped to the authenticated user.
 *
 * Endpoints:
 *   GET    /api/bank-accounts           - List all bank accounts for the user
 *   POST   /api/bank-accounts           - Create a new bank account
 *   GET    /api/bank-accounts/:id       - Get a single bank account by ID
 *   PUT    /api/bank-accounts/:id       - Update a bank account by ID
 *   DELETE /api/bank-accounts/:id       - Delete a bank account by ID
 *
 * Request body for create/update:
 *   {
 *     bankName: string,         // Required, min 2 chars
 *     accountNumber: string,    // Required, min 6 chars
 *     homeAddress?: string,     // Optional
 *     postalCode?: string       // Optional
 *   }
 *
 * Responses:
 *   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
 */

import type { HttpContext } from '@adonisjs/core/http'
import BankAccount from '#models/bank_account'
import { bankAccountValidator } from '#validators/BankAccountValidator'

export default class BankAccountsController {
  // List all bank accounts for the authenticated user
  public async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const accounts = await BankAccount.query().where('userId', userId)
    return response.json(accounts)
  }

  // Create a new bank account
  public async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(bankAccountValidator)
    // Prevent duplicate account number for the same user
    const exists = await BankAccount.query().where('userId', userId).where('accountNumber', data.accountNumber).first()
    if (exists) {
      return response.badRequest({ message: 'Account number already exists for this user.' })
    }
    const account = await BankAccount.create({ ...data, userId })
    return response.created(account)
  }

  // Show a single bank account (must belong to user)
  public async show({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const account = await BankAccount.query().where('id', params.id).where('userId', userId).first()
    if (!account) {
      return response.notFound({ message: 'Bank account not found.' })
    }
    return response.json(account)
  }

  // Update a bank account (must belong to user)
  public async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id
    const account = await BankAccount.query().where('id', params.id).where('userId', userId).first()
    if (!account) {
      return response.notFound({ message: 'Bank account not found.' })
    }
    const data = await request.validateUsing(bankAccountValidator)
    // Prevent duplicate account number for the same user (if changed)
    if (data.accountNumber && data.accountNumber !== account.accountNumber) {
      const exists = await BankAccount.query().where('userId', userId).where('accountNumber', data.accountNumber).first()
      if (exists) {
        return response.badRequest({ message: 'Account number already exists for this user.' })
      }
    }
    account.merge(data)
    await account.save()
    return response.json(account)
  }

  // Delete a bank account (must belong to user)
  public async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const account = await BankAccount.query().where('id', params.id).where('userId', userId).first()
    if (!account) {
      return response.notFound({ message: 'Bank account not found.' })
    }
    await account.delete()
    return response.ok({ message: 'Bank account deleted.' })
  }
}
