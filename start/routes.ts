
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";
import router from '@adonisjs/core/services/router'

const UsersController = () => import("#controllers/users_controller");

router.resource("users", UsersController)

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