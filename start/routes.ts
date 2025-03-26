
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";
import router from '@adonisjs/core/services/router'
// import AuthController from "#controllers/auth_controller";

// import AuthController from '#controllers/auth_controller'

const AuthController = () => import('#controllers/auth_controller')



router.group(() => {
  router.post('/signup', [AuthController, 'signup'])
  router.post('/login', [AuthController, 'login'])
  router.post('/forgot-password', [AuthController, 'forgotPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword']),
  router.post('/verify-email', [AuthController, 'verifyEmail'])
  router.post('/resend-verification-code', [AuthController, 'resendVerificationCode'])
  
}).prefix('/api/auth')

// returns swagger in YAML
router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger"); 
  // return AutoSwagger.default.rapidoc("/swagger", "view"); 
});