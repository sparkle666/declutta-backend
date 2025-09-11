import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DropAndRecreateWantsTable extends BaseSchema {
  protected tableName = 'wants'

  public async up() {
    // Drop the existing wants table
    this.schema.dropTable(this.tableName)
    // Recreate the wants table based on the current model
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.specificType('keywords', 'text[]').notNullable().defaultTo('{}')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    // Drop the wants table if rolling back
    this.schema.dropTable(this.tableName)
  }
}
