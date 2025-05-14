import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'

const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')
const ReviewsController = () => import('#controllers/reviews_controller')
const ImagesController = () => import('#controllers/images_controller')
const FavouriteProductsController = () => import('#controllers/favourite_products_controller')
const WantsController = () => import('#controllers/wants_controller')
const UsersController = () => import('#controllers/users_controller')


// Controller imports (lazy-loaded)
const AuthController = () => import('#controllers/auth_controller')

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
  // Categories
  router.post('/categories', [CategoriesController, 'store'])
  router.put('/categories/:id', [CategoriesController, 'update'])
  router.delete('/categories/:id', [CategoriesController, 'destroy'])

  // Products
  router.post('/products', [ProductsController, 'store'])
  router.put('/products/:id', [ProductsController, 'update'])
  router.delete('/products/:id', [ProductsController, 'destroy'])

  // Reviews
  router.post('/reviews', [ReviewsController, 'store'])
  router.put('/reviews/:id', [ReviewsController, 'update'])
  router.delete('/reviews/:id', [ReviewsController, 'destroy'])

  // Images
  router.post('/images', [ImagesController, 'store'])
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
})
  .prefix('/api')
  // .use(middleware.auth({ guard: 'api' }))  use this to ensure the auth middleware runs on these routes


// Swagger routes
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.scalar('/swagger')
  // return AutoSwagger.default.rapidoc('/swagger', 'view')
})