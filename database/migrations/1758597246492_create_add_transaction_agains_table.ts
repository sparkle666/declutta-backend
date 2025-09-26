import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddTransactionToOrders extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('transaction').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('transaction')
    })
  }
}
