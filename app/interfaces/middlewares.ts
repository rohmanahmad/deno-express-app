import express from 'express'

export type MiddlewareInterface = (
    request: express.Request,
    response?: express.Response,
    next?: express.NextFunction,
) => Promise<void>

export interface MiddlewaresMap {
    [key: string]: MiddlewareInterface
}
