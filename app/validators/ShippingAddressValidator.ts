import vine from '@vinejs/vine'

export const shippingAddressValidator = vine.compile(
  vine.object({
    address: vine.string().minLength(5),
    postalCode: vine.string().minLength(3),
    isDefault: vine.boolean().optional(),
  })
)
