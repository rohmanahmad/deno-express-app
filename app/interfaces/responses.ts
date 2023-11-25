export type Response2xx = {
    description: string
    schema: {
        type?: string
        $ref?: string
        properties?: {
            status: {
                type: string
                example: number
            }
            message: {
                type: string
                example: string
            }
            data?: {
                type: string
                example: string
            }
        }
    }
}

export type Response5xx = {
    description: string
    schema: {
        $ref?: string
        type?: string
        properties?: {
            status: {
                type: string
                example: number
            }
            message: {
                type: string
                example: string
            }
            error?: {
                type: string
                example: string
            }
        }
    }
}

export type Response4xx = {
    description: string
    schema: {
        $ref?: string
        type?: string
        properties?: {
            status: {
                type: string
                example: number
            }
            message: {
                type: string
                example: string
            }
            error?: {
                type: string | number | object
                example: string | number | object
            }
        }
    }
}
