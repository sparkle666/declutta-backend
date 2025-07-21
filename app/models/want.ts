import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

// ✅ Use `import type` for TypeScript type-only imports
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Want extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({
    prepare: (value: any) => value, // ✅ Insert as-is (array)
    consume: (value: any) => value, // ✅ Don't parse it, Postgres already returns JSON
  })
  declare keywords: string[]


  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
