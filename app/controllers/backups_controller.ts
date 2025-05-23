import type { HttpContext } from '@adonisjs/core/http'
import { put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'

export default class BackupsController {
  /**
   * POST /api/backup-db
   * Uploads the SQLite database file to Vercel Blob for backup.
   * Requires authentication (admin recommended).
   */
  public async backupDb({ response }: HttpContext) {
    const dbPath = 'database/db.sqlite3'
    try {
      const fileBuffer = await readFile(dbPath)
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const blobName = `backups/db-${dateStr}.sqlite3`
      
      await put(blobName, fileBuffer, {
        access: 'public', // Vercel Blob only supports 'public' for now
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      })

      return response.ok({
        status: 'success',
        message: 'Database backup uploaded to Vercel Blob.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Failed to upload database backup.',
        error: error.message || error.toString(),
      })
    }
  }
}
