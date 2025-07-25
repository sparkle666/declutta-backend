

// V2 Products endpoint (JSON with image URLs)
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')
const ReviewsController = () => import('#controllers/reviews_controller')
const ImagesController = () => import('#controllers/images_controller')
const FavouriteProductsController = () => import('#controllers/favourite_products_controller')
const WantsController = () => import('#controllers/wants_controller')
const UsersController = () => import('#controllers/users_controller')
const ChatMessagesController = () => import('#controllers/chat_messages_controller')
const BankAccountsController = () => import('#controllers/bank_accounts_controller')
const CardsController = () => import('#controllers/cards_controller')
const ShippingAddressesController = () => import('#controllers/shipping_addresses_controller')
const NotificationsController = () => import('#controllers/notifications_controller')
const BackupsController = () => import('#controllers/backups_controller')
const CheckoutController = () => import('#controllers/checkout_controller')



// Controller imports (lazy-loaded)
const AuthController = () => import('#controllers/auth_controller')

// V2 Products endpoint (JSON with image URLs)
// router.post('/v2/products', [ProductsController, 'storeV2']).use(middleware.auth({ guards: ['api'] }))

// Root route
router.get('/', () => {
  return { message: 'declutta backend' }
})

// Public routes (no auth required)
router.group(() => {
  router.get('/categories', [CategoriesController, 'index'])
  router.get('/categories/:id', [CategoriesController, 'show'])
  router.get('/products', [ProductsController, 'index'])
  router.get('/products/:id', [ProductsController, 'show'])
  router.get('/reviews', [ReviewsController, 'index'])
  router.get('/reviews/:id', [ReviewsController, 'show'])
  router.get('/users', [UsersController, 'index'])
  
  router.get('/backup-db', [BackupsController, 'backupDb'])
  
}).prefix('/api')

// Auth routes (public)
router.group(() => {
  router.post('/signup', [AuthController, 'signup'])
  router.post('/login', [AuthController, 'login'])
  router.post('/forgot-password', [AuthController, 'forgotPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword'])
  router.post('/verify-email', [AuthController, 'verifyEmail'])
  router.post('/resend-verification-code', [AuthController, 'resendVerificationCode'])

}).prefix('/api/auth')

// Protected routes (require authentication)
router.group(() => {
  // User routes                                               
  router.put('/users/:id', [UsersController, 'update'])
  router.get('/users/:id', [UsersController, 'getUserById'])
  router.delete('/users/:id', [UsersController, 'delete'])

  // Categories
  router.post('/categories', [CategoriesController, 'store'])
  router.put('/categories/:id', [CategoriesController, 'update'])
  router.delete('/categories/:id', [CategoriesController, 'destroy'])

  // Products
  router.post('/products', [ProductsController, 'store'])
  router.put('/products/:id', [ProductsController, 'update'])
  router.delete('/products/:id', [ProductsController, 'destroy'])
  router.post('/v2/products', [ProductsController, 'storeV2'])

  // Reviews
  router.post('/reviews', [ReviewsController, 'store'])
  router.put('/reviews/:id', [ReviewsController, 'update'])
  router.delete('/reviews/:id', [ReviewsController, 'destroy'])

  // Images
  router.post('/images', [ImagesController, 'store'])
  router.post('/vercel/upload/images', [ImagesController, 'uploadImages'])
  router.post('/vercel/upload/image', [ImagesController, 'uploadImage'])
  router.delete('/images/:id', [ImagesController, 'destroy'])

  // Favourite Products
  router.get('/favourites', [FavouriteProductsController, 'index'])
  router.post('/favourites', [FavouriteProductsController, 'store'])
  router.delete('/favourites/:id', [FavouriteProductsController, 'destroy'])

  // Wants
  router.get('/wants', [WantsController, 'index'])
  router.post('/wants', [WantsController, 'store'])
  router.get('/wants/:id', [WantsController, 'show'])
  router.put('/wants/:id', [WantsController, 'update'])
  router.delete('/wants/:id', [WantsController, 'destroy'])

  // Chats
  router.get('/chats/conversations', [ChatMessagesController, 'conversations'])
  router.get('/chats', [ChatMessagesController, 'index']) // ?userId=otherUserId
  router.post('/chats', [ChatMessagesController, 'store'])
  router.post('/chats/mark-as-read', [ChatMessagesController, 'markAsRead'])

  // Bank Accounts
  router.get('/bank-accounts', [BankAccountsController, 'index'])
  router.post('/bank-accounts', [BankAccountsController, 'store'])
  router.get('/bank-accounts/:id', [BankAccountsController, 'show'])
  router.put('/bank-accounts/:id', [BankAccountsController, 'update'])
  router.delete('/bank-accounts/:id', [BankAccountsController, 'destroy'])

  // Cards
  router.get('/cards', [CardsController, 'index'])
  router.post('/cards', [CardsController, 'store'])
  router.get('/cards/:id', [CardsController, 'show'])
  router.put('/cards/:id', [CardsController, 'update'])
  router.delete('/cards/:id', [CardsController, 'destroy'])

  // Shipping Addresses
  router.get('/shipping-addresses', [ShippingAddressesController, 'index'])
  router.post('/shipping-addresses', [ShippingAddressesController, 'store'])
  router.get('/shipping-addresses/:id', [ShippingAddressesController, 'show'])
  router.put('/shipping-addresses/:id', [ShippingAddressesController, 'update'])
  router.delete('/shipping-addresses/:id', [ShippingAddressesController, 'destroy'])

  // Notifications
  router.get('/notifications', [NotificationsController, 'index'])
  router.get('/notifications/unread', [NotificationsController, 'unread'])
  router.post('/notifications/:id/read', [NotificationsController, 'markAsRead'])
  router.post('/notifications', [NotificationsController, 'store'])
  router.delete('/notifications/:id', [NotificationsController, 'destroy'])

  // Checkout
  router.post('/checkout', [CheckoutController, 'checkout'])
  router.post('/paystack/webhook', [CheckoutController, 'paystackWebhook'])
  router.get('/orders/:id', [CheckoutController, 'show'])

  // Backup DB
})
  .prefix('/api')
  .use(middleware.auth({ guards: ['api'] }))  // use this to ensure the auth middleware runs on these routes


// Swagger routes
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.scalar('/swagger')
  // return AutoSwagger.default.rapidoc('/swagger', 'view')
})
router.get('/docs/rapid', async () => {
  // return AutoSwagger.default.scalar('/swagger')
  return AutoSwagger.default.rapidoc('/swagger', 'view')
})