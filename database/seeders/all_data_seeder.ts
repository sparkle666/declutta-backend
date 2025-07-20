import User from '#models/user'
import Product from '#models/product'
import Category from '#models/category'
import Review from '#models/review'
import BankAccount from '#models/bank_account'
import Card from '#models/card'
import ShippingAddress from '#models/shipping_address'
import { faker } from '@faker-js/faker'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AllDataSeeder extends BaseSeeder {
  public async run() {
    // Seed Categories
    // for (let i = 0; i < 5; i++) {
    //   await Category.create({
    //     categoryName: faker.commerce.department(),
    //   })
    // }

    // // Seed Users
    // for (let i = 0; i < 10; i++) {
    //   await User.create({
    //     email: faker.internet.email(),
    //     password: 'password123',
    //     fullName: faker.person.fullName(),
    //     firstName: faker.person.firstName(),
    //     lastName: faker.person.lastName(),
    //     isEmailVerified: faker.datatype.boolean(),
    //   })
    // }

    // // Seed Products
    // const categories = await Category.all()
    const users = await User.all()
    // for (let i = 0; i < 20; i++) {
    //   const product = await Product.create({
    //     productName: faker.commerce.productName(),
    //     productPrice: Number(faker.commerce.price()),
    //     productLocation: faker.location.city(),
    //     categoryId: faker.helpers.arrayElement(categories).id,
    //     listedBy: faker.helpers.arrayElement(users).id,
    //     productStatus: faker.helpers.arrayElement(['available', 'sold', 'in stock']),
    //     productDetails: faker.commerce.productDescription(),
    //     isFree: faker.datatype.boolean(),
    //     isForSale: faker.datatype.boolean(),
    //     condition: faker.helpers.arrayElement(['new', 'used']),
    //   })
    //   // Seed Images for each product
    //   for (let j = 0; j < faker.number.int({ min: 1, max: 4 }); j++) {
    //     await product.related('images').create({
    //       imageUrl: faker.image.urlPicsumPhotos(),
    //     })
    //   }
    // }

    // // Seed Reviews
    // const products = await Product.all()
    // for (let i = 0; i < 30; i++) {
    //   await Review.create({
    //     productId: faker.helpers.arrayElement(products).id,
    //     userId: faker.helpers.arrayElement(users).id,
    //     rating: faker.number.int({ min: 1, max: 5 }),
    //     comment: faker.lorem.sentence(),
    //   })
    // }

    // // Seed Bank Accounts
    // for (let i = 0; i < 10; i++) {
    //   await BankAccount.create({
    //     userId: faker.helpers.arrayElement(users).id,
    //     bankName: faker.finance.accountName(),
    //     accountNumber: faker.finance.accountNumber(),
    //     homeAddress: faker.location.streetAddress(),
    //     postalCode: faker.location.zipCode(),
    //   })
    // }

    // // Seed Cards
    // for (let i = 0; i < 10; i++) {
    //   await Card.create({
    //     userId: faker.helpers.arrayElement(users).id,
    //     cardNumber: faker.finance.creditCardNumber(),
    //     cardHolderName: faker.person.fullName(),
    //     bankName: faker.finance.accountName(),
    //     expirationDate: faker.date.future().toISOString().slice(0, 7),
    //     isDefault: faker.datatype.boolean(),
    //   })
    // }

    // // Seed Shipping Addresses
    // for (let i = 0; i < 10; i++) {
    //   await ShippingAddress.create({
    //     userId: faker.helpers.arrayElement(users).id,
    //     address: faker.location.streetAddress(),
    //     postalCode: faker.location.zipCode(),
    //     isDefault: faker.datatype.boolean(),
    //   })
    // }

    // --- NEW SEEDING FOR OTHER MODELS ---
    // Seed Wants
    for (let i = 0; i < 10; i++) {
      await (await import('#models/want')).default.create({
        userId: faker.helpers.arrayElement(users).id,
        name: faker.commerce.productName(),
        keywords: [
          faker.commerce.productAdjective(),
          faker.commerce.productMaterial(),
          faker.commerce.product()
        ],
      })
    }

    // Seed Notifications
    for (let i = 0; i < 10; i++) {
      await (await import('#models/notification')).default.create({
        userId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
      })
    }

    // Seed Carts
    // for (let i = 0; i < 10; i++) {
    //   await (await import('#models/cart')).default.create({
    //     userId: faker.helpers.arrayElement(users).id,
    //   })
    // }

    // // Seed Orders
    // for (let i = 0; i < 10; i++) {
    //   await (await import('#models/order')).default.create({
    //     userId: faker.helpers.arrayElement(users).id,
    //     total: Number(faker.commerce.price()),
    //     status: faker.helpers.arrayElement(['pending', 'paid', 'failed']),
    //     paystackRef: faker.string.uuid(),
    //   })
    // }
    // --- END NEW SEEDING ---
  }
}
