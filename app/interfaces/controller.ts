import express from 'express'

export type ConrollerInterface = (
    request: express.Request,
    response?: express.Response,
    next?: express.NextFunction,
) => Promise<void>
