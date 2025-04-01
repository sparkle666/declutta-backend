import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favourite_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() // Optional primary key
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.unique(['user_id', 'product_id']) // Prevents duplicate favorites
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}