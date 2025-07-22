import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddProfilePictureToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profile_picture', 255).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('profile_picture')
    })
  }
}
