import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Review from './review.js'
import Want from './want.js'
import Product from './product.js'

// ✅ Use `import type` for TypeScript type-only imports
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'full_name' })
  declare fullName: string | null

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column()
  declare role: 'user' | 'admin' // Adjust the roles as needed

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare resetPasswordToken: string | null

  @column.dateTime()
  declare resetPasswordExpires: DateTime | null

  @column()
  declare emailVerificationCode: string | null

  @column.dateTime()
  declare emailVerificationCodeExpires: DateTime | null

  @column()
  declare isEmailVerified: boolean

  @column()
  declare bio: string | null

  @column()
  declare gender: 'male' | 'female' | 'other' | null

  @column()
  declare phoneNumber: string | null

  @column.dateTime()
  declare dateOfBirth: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ✅ Fixed: `import type` prevents TS error
  @hasMany(() => Product, { foreignKey: 'listedBy' })
  public products!: HasMany<typeof Product>

  @hasMany(() => Review, { foreignKey: 'user_id' })
  public reviews!: HasMany<typeof Review>

  @hasMany(() => Want, { foreignKey: 'user_id' })
  public wants!: HasMany<typeof Want>

  @manyToMany(() => Product, {
    pivotTable: 'favourite_products',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'product_id',
  })
  public favourites!: ManyToMany<typeof Product>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
