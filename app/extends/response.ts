import * as e from 'express'
// response overide
// https://expressjs.com/en/guide/overriding-express-api.html

type OptionsErrorResponse = {
    statusCode: number
    message: string
}
export default function () {
    e.response.apiSuccess = function (
        message = 'ok',
        data?: object,
    ): e.Response {
        return this
            .status(200)
            .json({
                statusCode: 200,
                message,
                data,
            })
    }
    e.response.apiCollection = function (
        data = {},
        statusCode = 200,
        message = 'Data Retrive',
    ): e.Response {
        return this
            .status(statusCode)
            .json({
                statusCode,
                message,
                data,
            })
    }
    e.response.apiError = function (
        err: typeof Error,
        options?: OptionsErrorResponse,
    ): e.Response {
        const statusCode = options?.statusCode || 500
        if (statusCode) this.status(statusCode)
        return this.json({
            statusCode,
            message: err.name,
            error: err,
        })
    }
}
