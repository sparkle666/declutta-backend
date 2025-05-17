import vine from '@vinejs/vine'

export const chatMessageValidator = vine.compile(
  vine.object({
    receiverId: vine.number().positive(),
    message: vine.string().minLength(1).maxLength(1000),
  })
)
