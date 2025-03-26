import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email_verification_code').nullable()
      table.timestamp('email_verification_code_expires').nullable()
      table.boolean('is_email_verified').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email_verification_code')
      table.dropColumn('email_verification_code_expires')
      table.dropColumn('is_email_verified')
    })
  }
}