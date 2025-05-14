
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enu('role', ['user', 'admin', ]).defaultTo('admin')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }
}
