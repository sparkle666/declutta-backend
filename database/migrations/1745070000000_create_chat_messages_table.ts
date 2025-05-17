import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('message').notNullable()
      table.boolean('is_read').defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
