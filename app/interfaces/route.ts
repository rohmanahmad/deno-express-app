import express from 'express'

import { Response2xx, Response4xx, Response5xx } from './responses.ts'

export type SingleRouteInterface = {
    name: string
    path: string
    method: string
    middlewares: Array<'auth'>
    controller: (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) => Promise<void>
    swagger: {
        tags: Array<string>
        summary: string
        description?: string
        consumes?: Array<'application/json' | 'application/xml'>
        produces?: Array<'application/json' | 'application/xml'>
        parameters?: Array<string>
        requires?: Array<string>
        responses: {
            '200': Response2xx
            '500': Response5xx
            '404': Response4xx
        }
    }
}

export type RouteListInterface = {
    name: string
    prefix: string
    list: Array<SingleRouteInterface>
}
export type RouteGroupInterface = {
    accountRoutes: RouteListInterface
}
