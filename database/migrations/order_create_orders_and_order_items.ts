import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.createTable('orders', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('status').defaultTo('pending')
      table.decimal('total', 12, 2)
      table.string('paystack_ref').nullable()
      table.timestamps(true)
    })

    this.schema.createTable('order_items', (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products')
      table.integer('quantity').unsigned()
      table.decimal('price', 12, 2)
    })
  }

  public async down () {
    this.schema.dropTable('order_items')
    this.schema.dropTable('orders')
  }
}
