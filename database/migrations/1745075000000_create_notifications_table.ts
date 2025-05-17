import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('message').notNullable()
      table.string('action_url').nullable()
      table.boolean('is_read').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
