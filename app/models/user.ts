import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number

    @column({columnName: "full_name"})
    declare fullName: string | null

    @column()
    declare firstName: string | null

    @column()
    declare lastName: string | null

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    // New columns for password reset
    @column()
    declare resetPasswordToken: string | null

    @column.dateTime()
    declare resetPasswordExpires: DateTime | null


    // New columns for email verification
    @column()
    declare emailVerificationCode: string | null
  
    @column.dateTime()
    declare emailVerificationCodeExpires: DateTime | null
  
    @column()
    declare isEmailVerified: boolean
  
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
  
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}


