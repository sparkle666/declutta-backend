import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateOrderStatusColumns extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('status', 'payment_status')
      table.string('order_status').notNullable().defaultTo('pending')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('payment_status', 'status')
      table.dropColumn('order_status')
    })
  }
}
