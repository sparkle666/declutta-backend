import vine from '@vinejs/vine'

export const wantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    keywords: vine.array(
      vine.string().trim().maxLength(50)
    ).minLength(1),
  })
)