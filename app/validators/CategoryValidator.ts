import vine from '@vinejs/vine'

export const categoryValidator = vine.compile(
  vine.object({
    categoryName: vine.string().trim().minLength(1).maxLength(50),
  })
)