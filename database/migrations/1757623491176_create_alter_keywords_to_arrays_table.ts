import { BaseSchema } from '@adonisjs/lucid/schema'

export default class WantsSchema extends BaseSchema {
  protected tableName = 'wants'

  public async up() {
    // Convert keywords from text to text[] (preserving data)
    await this.db.raw(
      `ALTER TABLE wants ALTER COLUMN keywords TYPE text[] USING string_to_array(keywords, ',')`
    )
  }

  public async down() {
    // Convert back to text (if needed)
    await this.db.raw(
      `ALTER TABLE wants ALTER COLUMN keywords TYPE text USING array_to_string(keywords, ',')`
    )
  }
}