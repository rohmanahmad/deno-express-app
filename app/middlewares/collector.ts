import express from 'express'

export const CollectorMiddleware = async function collector(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
): Promise<void> {
    const queries = request.query
    const body = request.body
    const params = request.params
    next()
}
