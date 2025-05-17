import vine from '@vinejs/vine'

export const notificationValidator = vine.compile(
  vine.object({
    userId: vine.number().nullable().optional(), // null for universal
    title: vine.string().minLength(2),
    message: vine.string().minLength(2),
    actionUrl: vine.string().optional(),
  })
)
