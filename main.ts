import Server from './app/server.ts'
import env from './env.json' with { type: 'json' }
import { Env } from './app/interfaces/env.ts'

// configs
import configApp from './app/configs/app.ts'
import configProviders from './app/configs/providers.ts'

// middlewares
import { AuthMiddleware } from './app/middlewares/auth.ts'
import { CollectorMiddleware } from './app/middlewares/collector.ts'

// // providers
// import e2eProvider from './app/providers/e2e.ts'
// import mongodbProvider from './app/providers/mongodb.ts'
// import mysqlProvider from './app/providers/mysql.ts'
// import redisProvider from './app/providers/redis.ts'

// routes
import routes from './app/routes.ts'

Object.keys(env).forEach((key) => {
    const value = env[key as keyof Env]
    Deno.env.set(key, value)
})
new Server()
    .setConfig({
        app: configApp,
        providers: configProviders,
    })
    .setMiddleware({
        auth: AuthMiddleware,
        collector: CollectorMiddleware,
    })
    // .setProvider({
    //     e2e: e2eProvider,
    //     mongodb: mongodbProvider,
    //     mysql: mysqlProvider,
    //     redis: redisProvider,
    // })
    .setRoutes(routes)
    .start()
