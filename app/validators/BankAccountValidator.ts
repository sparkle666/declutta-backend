import vine from '@vinejs/vine'

export const bankAccountValidator = vine.compile(
  vine.object({
    bankName: vine.string().minLength(2),
    accountNumber: vine.string().minLength(6),
    homeAddress: vine.string().optional(),
    postalCode: vine.string().optional(),
  })
)
