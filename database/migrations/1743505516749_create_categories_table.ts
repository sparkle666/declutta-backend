import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('category_name').notNullable()
      table.timestamps(true, true) // Adds created_at and updated_at

    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

