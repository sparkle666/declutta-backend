import path from "node:path";
import url from "node:url";
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../", // for AdonisJS v6
  title: "Declutta Backend", // use info instead
  version: "1.0.0", // use info instead
  description: "", // use info instead
  tagIndex: 2,
  productionEnv: "production", // optional
  info: {
    title: "Declutta",
    version: "1.0.0",
    description: "The documentation for Declutta backend based on AdonisJs",
  },
  snakeCase: true,

  debug: false, // set to true, to get some useful debug output
  ignore: ["/swagger", "/docs"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
  
    },
  authMiddlewares: ["auth", "auth:api"], // optional
  defaultSecurityScheme: "BearerAuth", // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary

  spec: {
    // apis: [
    //   './app/controllers/**/*.ts', // Corrected path for AdonisJS v6
    // ],

   apis: [
    process.env.NODE_ENV === 'production'
      ? './build/app/controllers/**/*.js'
      : './app/controllers/**/*.ts',
    process.env.NODE_ENV === 'production'
      ? './build/app/models/**/*.js'
      : './app/models/**/*.ts',
  ],
  },
}
}