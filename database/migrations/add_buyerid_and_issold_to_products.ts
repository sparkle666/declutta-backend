import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddBuyerIdAndIsSoldToProducts extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('buyer_id').unsigned().nullable().references('id').inTable('users')
      table.boolean('is_sold').notNullable().defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('buyer_id')
      table.dropColumn('is_sold')
    })
  }
}
