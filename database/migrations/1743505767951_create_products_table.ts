import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('product_name').notNullable()
      table.string('product_location').notNullable()
      table.enu('product_status', ['available', 'sold', 'in stock']).notNullable()
      table.integer('listed_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('product_price', 10, 2).notNullable()
      table.text('product_details')
      table.boolean('is_free').defaultTo(false)
      table.boolean('is_for_sale').defaultTo(true)
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}