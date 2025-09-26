import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import OrderItem from './order_item.js'


export default class Order extends BaseModel {
  @column()
  declare transaction: string | null
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  // This should be payment status
  @column()
  declare paymentStatus: 'pending' | 'paid' | 'failed' | 'completed'
  
  @column()
  declare orderStatus: 'sent' | 'cancelled' | 'enroute' | 'received' | 'pending'

  @column()
  declare total: number

  @column()
  declare paystackRef: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>
}
