import AppConfig from '../configs/app.ts'
import { globalMiddlewares } from '../configs/middlewares.ts'
import providerConfig from '../configs/providers.ts'

export type AppConfig = typeof AppConfig

export type GlobalMiddlewaresConfig = typeof globalMiddlewares

export type ProvidersConfig = typeof providerConfig

export type ConfigInterface = {
    app: AppConfig
    middlewares: GlobalMiddlewaresConfig
    providers: ProvidersConfig
}

export interface ConfigMap {
    [key: string]: AppConfig | GlobalMiddlewaresConfig | ProvidersConfig
}
