import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Greet extends BaseCommand {
  static commandName = 'greet'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "Greet"')
  }
}