import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddExtraFieldsToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('bio').nullable()
      table.string('gender', 10).nullable()
      table.string('phone_number', 20).nullable()
      table.timestamp('date_of_birth').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('bio')
      table.dropColumn('gender')
      table.dropColumn('phone_number')
      table.dropColumn('date_of_birth')
    })
  }
}
