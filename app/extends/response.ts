// response overide
// https://expressjs.com/en/guide/overriding-express-api.html

export default function (instance) {
    instance.response.apiSuccess = function (message='ok', data) {
        return this
            .status(200)
            .json({
                statusCode: 200,
                message,
                data
            })
    }
    instance.response.apiCollection = function (data={}, statusCode=200, message='Data Retrive') {
        return this
            .status(statusCode)
            .json({
                statusCode,
                message,
                data
            })
    }
    instance.response.apiError = function (message, statusCode=500, errorData) {
        return this
            .status(statusCode)
            .json({
                statusCode,
                message,
                error: errorData
            })
    }
}