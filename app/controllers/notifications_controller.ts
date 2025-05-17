/**
 * NotificationsController handles both universal (system-wide) and personal notifications.
 *
 * - Universal notifications have userId = null and are visible to all users.
 * - Personal notifications have userId set and are visible only to that user.
 * - All endpoints require authentication.
 *
 * Endpoints:
 *   GET    /api/notifications           - List all notifications for the user (universal + personal)
 *   GET    /api/notifications/unread    - List only unread notifications
 *   POST   /api/notifications/:id/read  - Mark a notification as read
 *   POST   /api/notifications           - Create a notification (admin/system only)
 *   DELETE /api/notifications/:id       - Delete a notification (admin/system only)
 *
 * Request body for create:
 *   {
 *     userId?: number,      // Optional, null for universal
 *     title: string,        // Required
 *     message: string,      // Required
 *     actionUrl?: string    // Optional
 *   }
 *
 * Responses:
 *   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
 */
import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'
import { notificationValidator } from '#validators/NotificationValidator'

export default class NotificationsController {
  public async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const notifications = await Notification.query()
      .whereNull('userId')
      .orWhere('userId', userId)
      .orderBy('created_at', 'desc')
    return response.json(notifications)
  }

  public async unread({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const notifications = await Notification.query()
      .where((q) => {
        q.whereNull('userId').orWhere('userId', userId)
      })
      .where('isRead', false)
      .orderBy('created_at', 'desc')
    return response.json(notifications)
  }

  public async markAsRead({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const notification = await Notification.query()
      .where('id', params.id)
      .where((q) => {
        q.whereNull('userId').orWhere('userId', userId)
      })
      .first()
    if (!notification) {
      return response.notFound({ message: 'Notification not found.' })
    }
    notification.isRead = true
    await notification.save()
    return response.ok(notification)
  }

  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(notificationValidator)
    const notification = await Notification.create(data)
    return response.created(notification)
  }

  public async destroy({ params, response }: HttpContext) {
    const notification = await Notification.find(params.id)
    if (!notification) {
      return response.notFound({ message: 'Notification not found.' })
    }
    await notification.delete()
    return response.ok({ message: 'Notification deleted.' })
  }
}
