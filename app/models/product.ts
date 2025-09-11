// app/models/product.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import User from './user.js'
import Review from './review.js'
import Image from './image.js'

// ✅ Use `import type` for TypeScript type-only imports
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productName: string

  @column()
  declare productLocation: string

  @column()
  declare productStatus: 'available' | 'sold' | 'in stock'

  @column({ columnName: 'listed_by' }) // ✅ This makes sure it matches the relationship
  declare listedBy: number

  @column()
  declare productPrice: number

  @column()
  declare productDetails: string | null

  @column()
  declare isFree: boolean

  @column()
  declare isForSale: boolean

  @column()
  declare saleType: 'free' | 'for_sale'

  @column()
  declare categoryId: number

  @column()
  declare condition: 'new' | 'used'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare buyerId: number | null

  @column()
  declare isSold: boolean

  @belongsTo(() => User, { foreignKey: 'buyerId' })
  public buyer!: BelongsTo<typeof User>

  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => User, {
    foreignKey: 'listed_by', // ✅ Make sure this matches the column name
  })
  declare listedByUser: BelongsTo<typeof User>

  @hasMany(() => Review, {
    foreignKey: 'productId',
  })
  declare reviews: HasMany<typeof Review>

  @hasMany(() => Image, {
    foreignKey: 'productId',
  })
  declare images: HasMany<typeof Image>

  @manyToMany(() => User, {
    pivotTable: 'favourite_products',
    pivotForeignKey: 'product_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare favouritedBy: ManyToMany<typeof User>
}
