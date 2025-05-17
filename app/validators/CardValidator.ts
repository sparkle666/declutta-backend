import vine from '@vinejs/vine'

export const cardValidator = vine.compile(
  vine.object({
    cardNumber: vine.string().minLength(12).maxLength(19),
    cardHolderName: vine.string().minLength(2),
    bankName: vine.string().minLength(2),
    expirationDate: vine.string().regex(/^\d{2}\/\d{2}$/), // MM/YY
    isDefault: vine.boolean().optional(),
  })
)
