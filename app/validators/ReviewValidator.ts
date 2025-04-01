import vine from '@vinejs/vine'

export const reviewValidator = vine.compile(
  vine.object({
    comment: vine.string().trim().maxLength(500).optional(),
    rating: vine.number().min(1).max(5),

    productId: vine.number().exists(async (db, value) => {
        // IMPORTANT: Execute the query and check for existence within the callback
  
        // Use .first() which returns the record or null
        const product = await db.query().from('products').where('id', value).first();
        return !!product;

    }),
  })
)