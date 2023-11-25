import express from 'express'
import compression from 'compression'
import getResult from 'lodash.result'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import { createTerminus } from '@godaddy/terminus'
import responseExtend from './extends/response.ts'
import { logInfo } from './helpers/logger.ts'
import {
    MiddlewareInterface,
    MiddlewaresMap,
} from './interfaces/middlewares.ts'
// import { Providers as ProviderInterface } from './interfaces/providers.ts'
import routes from './routes.ts'
import { RouteGroupInterface } from './interfaces/route.ts'
import { globalMiddlewares } from './configs/middlewares.ts'
import { ConfigInterface } from './interfaces/config.ts'

const isInDevelopment: boolean = Deno.env.get('NODE_ENV') !== 'PRODUCTION'

type acceptedMiddlewares = 'auth' | 'collector'

const app = express()

app.use('/public', express.static('statics'))

export default class Server {
    #host = '127.0.0.1'
    #port = 3000
    #routes = routes
    #config?: ConfigInterface
    #middlewares?: MiddlewaresMap
    // #providers: ProviderInterface

    contructor(host: string, port: number) {
        this.#host = host
        this.#port = port
    }

    // SETTER
    setConfig(objConfig: ConfigInterface) {
        this.#config = objConfig
        return this
    }
    setMiddleware(value: MiddlewaresMap) {
        this.#middlewares = value
        return this
    }
    // setProvider(value: Providers) {
    //     this.#providers = value
    //     return this
    // }
    setRoutes(allRoutes: RouteGroupInterface) {
        this.#routes = allRoutes
        return this
    }
    // END OF SETTER

    // GETTER
    // getAllMiddlewares() {
    //     const allMiddlewares = getResult(this.#config, 'middlewares', {})
    //     return allMiddlewares
    // }
    getGlobalMiddlewares(): Array<MiddlewareInterface> {
        if (globalMiddlewares.length > 0) {
            const mw = this.#middlewares
            return globalMiddlewares
                .filter((x: string) => {
                    const valid1 = x.length > 1
                    const valid2 = mw && mw[x]
                    const valid3 = mw && typeof mw[x] === 'function'
                    return valid1 && valid2 && valid3
                })
        }
        return []
    }
    // getRouteMiddlewares(namedMiddlewares: Array<string> = []) { // string array
    //     const allMiddlewares = this.#middlewares
    //     const middlewares = namedMiddlewares
    //         .map((x) => allMiddlewares[x])
    //         .filter((x) => x)
    //         .map((x) => x.bind(this))
    //     return middlewares
    // }
    // END OF GETTER

    async routes(): Promise<void> {
        try {
            app.disable('x-powered-by')
            app.use(helmet())
            // parse application/x-www-form-urlencoded
            app.use(bodyParser.urlencoded({ extended: true }))
            // app.use(bodyParser.raw())
            // parse application/json
            app.use(bodyParser.json())
            await this.registerProviders()
            if (isInDevelopment) {
                app.use(compression()) // best practice for performance
            }
            if (this.#routes) {
                let swaggerPaths = {}
                const routeKeys = Object.keys(this.#routes) as Array<
                    'accountRoutes'
                >
                for (const routeGroup of routeKeys) {
                    const group = this.#routes[routeGroup]
                    const groupName = getResult(group, 'routes.name', '-')
                    const routePrefix = getResult(group, 'routes.prefix', '-')
                    const routeList = getResult(group, 'routes.list', [])
                    if (routeList.length === 0) continue
                    for (const route of routeList) {
                        const method = route.method || 'GET' // default route is GET
                        const routeName = [
                            route.method.toLowerCase(),
                            groupName,
                            route.name,
                        ].join('_').replace('-', '_')
                        const gM = this.getGlobalMiddlewares()
                        const middlewares = [].concat(gM)
                        const routeComponent = {
                            name: routeName,
                            group_name: groupName,
                            method,
                            path: join(routePrefix, route.path),
                            middlewares,
                            controller: route.controller,
                        }
                        this.registerRoute(routeComponent)
                        const swg = route.swagger
                        if (!swg) continue
                        const m = method.toLowerCase()
                        let routeComponentPath = routeComponent.path
                        if (swg.parameters) {
                            const swgParametersPath = swg.parameters
                                .filter((x: string) => x.indexOf('path.') > -1)
                                .map((x: string) => x.replace('path.', ''))
                            routeComponentPath = swgParametersPath
                                .reduce((r, x) => {
                                    return r.replace(`:${x}`, `{${x}}`)
                                }, routeComponentPath)
                        }
                        swaggerPaths[routeComponentPath] = {
                            [m]: {
                                tags: swg.tags || [],
                                summary: swg.summary || '',
                                description: swg.description || '',
                                consumes: swg.consumes || [],
                                produces: swg.produces || [],
                                parameters: (swg.parameters || []).map((x) =>
                                    docs.definition(
                                        x,
                                        swg.requires,
                                        swg.enums,
                                        swg.defaults,
                                    )
                                ),
                                responses: swg.responses || {},
                            },
                        }
                    }
                }
                docs.swaggerDoc(app, swaggerPaths)
                // registering route not-found
                this.registerRoute({
                    name: 'any_not_found',
                    group_name: 'not_found',
                    method: 'all',
                    path: '*',
                    middlewares: [],
                    controller: function (request, response) {
                        response.status(404).json({
                            status: 404,
                            method: request.method,
                            message: 'HTTP URL Not Found',
                        })
                    },
                })
                app.use(this.handleError.bind(this)) // handling error
            }
        } catch (err) {
            throw err
        }
    }

    async registerProviders() {
        try {
            this.providerInstance = {}
            this.providers = {}
            for (const pName in providers) {
                logInfo(`Registering Provider (${pName})`)
                const Provider = Provider[pName]
                const p = new Provider(this.#config.providers[pName])
                if (!p.boot) {
                    throw new Error(
                        `In (${pName}) Provider required "boot" function.`,
                    )
                }
                if (!p.close) {
                    throw new Error(
                        `In (${pName}) Provider required "close" function.`,
                    )
                }
                this.providers[pName] = await p.boot()
                this.providerInstance[pName] = p // digunakan hanya ketika server closing / exiting / sigterm (untuk panggil "close")
            }
            return true
        } catch (err) {
            throw err
        }
    }

    registerRoute({ name, method, path, middlewares, controller }) {
        method = method.toLowerCase()
        logInfo('Registering Route', name, `[${method.toUpperCase()}]`, path)
        let r = app[method]
        if (typeof app[method] !== 'function') {
            throw new Error(
                `Invalid method [${method.toUpperCase()}] from route "${name}"!`,
            )
        }
        app[method](path, middlewares, controller.bind(this))
    }

    async start() {
        try {
            logInfo(`Starting ${this.#config.app.node_env} Server`)
            let host = this.#host,
                port = this.#port
            if (!host) {
                host = getResult(this.#config, 'app.server.host', '127.0.0.1')
            }
            if (!port) {
                port = parseInt(
                    getResult(this.#config, 'app.server.port', 3000),
                )
            }
            await this.routes()
            this.overideResponse()
            const server = http.createServer(app)
            const instance = server.listen(port, host, () => {
                logInfo(`Server Listen on http://${host}:${port}`)
            })
            this.listenSignal(instance)
        } catch (err) {
            console.error(err)
            Deno.exit()
        }
    }
    overideResponse() {
        responseExtend(app)
    }
    listenSignal(instance) {
        const sigInt = () => {
            logInfo('SIGINT signal received: closing HTTP server')
            instance.close(async () => {
                logInfo('HTTP server closed')
                await this.closingProviders()
            })
        }
        Deno.addSignalListener('SIGINT', sigInt)
        createTerminus(instance, {
            signal: 'SIGINT',
            healthChecks: { '/health/status': this.healthCheck },
            onSignal: this.onSignal,
        })
    }
    async onSignal() {
        logInfo('Server Shutting Down...')
        await this.closingProviders()
        return true
    }
    async closingProviders() {
        for (const pName in this.providerInstance) {
            const p = this.providerInstance[pName]
            logInfo(`Closing Connection on (${pName})`)
            await p.close()
        }
        return true
    }
    async healthCheck({ state }) {
        return state
    }
    handleError(error, request, response, next) {
        const statusCode = 500,
            message = error && error.message ? error.message : 'Server Error'
        if (!response.headerSent) {
            response
                .status(statusCode)
                .json({
                    path: request.path,
                    method: request.method,
                    status: statusCode,
                    message,
                })
        }
        if (error) onerror(error)
    }
}
