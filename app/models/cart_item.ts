import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'
import Product from './product.js'


export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cartId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
