import vine from '@vinejs/vine'

export const favouriteProductValidator = vine.compile(
  vine.object({
    productId: vine.number().exists(async (db, value) => {
        // IMPORTANT: Execute the query and check for existence within the callback
        // Use .first() which returns the record or null
        const product = await db.query().from('products').where('id', value).first();
        return !!product;

    }),
  })
)