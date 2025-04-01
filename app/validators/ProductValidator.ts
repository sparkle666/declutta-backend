import vine from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    productName: vine.string().trim().minLength(1).maxLength(100),
    productLocation: vine.string().trim().minLength(1).maxLength(100),
    productStatus: vine.enum(['available', 'sold', 'in stock']),
    productPrice: vine.number().min(0).max(1000000),
    productDetails: vine.string().trim().maxLength(500).optional(),
    isFree: vine.boolean().optional(),
    isForSale: vine.boolean().optional(),
    categoryId: vine.number().exists(async (db, value) => {
      // IMPORTANT: Execute the query and check for existence within the callback

      // Use .first() which returns the record or null
      const category = await db.query().from('categories').where('id', value).first();

      // Return true if a category was found (is truthy), false otherwise
      return !!category;
      // The '!!' operator converts a truthy value (the category object) to true
      // and a falsy value (null) to false.
      // This ensures the callback returns Promise<boolean>
    }),
  })
)