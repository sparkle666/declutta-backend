import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('cards', (table) => {
      table.string('card_holder_name').notNullable().defaultTo('')
    })
  }

  public async down() {
    this.schema.alterTable('cards', (table) => {
      table.dropColumn('card_holder_name')
    })
  }
}
