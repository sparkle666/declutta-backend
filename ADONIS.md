🔧 General Commands

node ace list
→ Shows all available Ace commands.

node ace serve --watch
→ Starts the AdonisJS HTTP server in development mode with auto-reload.

node ace build
→ Builds the project for production.

node ace repl
→ Starts an interactive REPL for debugging and testing.

🗄️ Database & Migrations

node ace make:migration <name>
→ Create a new migration file.
Example: node ace make:migration users

node ace migration:run
→ Run all pending migrations.

node ace migration:rollback
→ Roll back the last batch of migrations.

node ace migration:reset
→ Roll back all migrations.

node ace migration:fresh
→ Reset database by rolling back & re-running all migrations.

node ace db:seed
→ Run all seeders.

node ace make:seeder <name>
→ Create a new seeder file.

📦 Models & Factories

node ace make:model <name>
→ Create a new model.
Options:

-m → Create model with migration

-c → Create model with controller

-f → Create model with factory

Example: node ace make:model User -m -c -f

node ace make:factory <name>
→ Create a new factory.

🎮 Controllers & Middleware

node ace make:controller <name>
→ Create a new controller.
Options:

-r → Resourceful controller (CRUD style)

Example: node ace make:controller User -r

node ace make:middleware <name>
→ Create a new middleware.

🔑 Auth & Security

node ace make:validator <name>
→ Create a new request validator.

node ace make:policy <name>
→ Create a new authorization policy.

node ace generate:key
→ Generate a new app key (for encryption & cookies).

🎨 Other Useful Commands

node ace make:command <name>
→ Create a custom Ace CLI command.

node ace dump:rcfile
→ Show resolved .adonisrc.json config.

node ace configure <package>
→ Configure a package after installation.
Example: node ace configure @adonisjs/auth