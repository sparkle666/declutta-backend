import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSaleTypeToProducts extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('sale_type', ['free', 'for_sale']).notNullable().defaultTo('for_sale')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sale_type')
    })
  }
}
