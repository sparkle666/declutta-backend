import vine from '@vinejs/vine'

export const orderValidator = vine.compile(
  vine.object({
    paymentStatus: vine.enum(['pending', 'paid', 'failed', 'completed']).optional(),
    orderStatus: vine.enum(['sent', 'cancelled', 'enroute', 'received', 'pending']).optional(),
    transaction: vine.string().trim().optional(),
    paystackRef: vine.string().trim().optional(),
    total: vine.number().min(0).optional(),
  })
)
