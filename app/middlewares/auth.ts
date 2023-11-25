import express from 'express'

export const AuthMiddleware = async function auth(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
): Promise<void> {
    const queries = request.params
    next()
}
