'use strict'

const env = Deno.env

const getEnv = (key: string) => {
    return env.get('PROVIDER_' + key)
}

export default {
    components: [
        // 'e2e', /* before activate this provider, please run this command first: npm i --save tweetnacl tweetnacl-util */
        // 'mongodb', /* before activate this provider, please run this command first: npm i --save mongodb */
        'mysql', /* before activate this provider, please run this command first: npm i --save mysql2 */
        // 'redis', /* before activate this provider, please run this command first: npm i --save redis */
    ],
    mongodb: {
        dsn: getEnv('MONGODB_DSN')
    },
    mysql: {
        connection: {
            host: getEnv('MYSQL_HOST'),
            port: getEnv('MYSQL_PORT'),
            user: getEnv('MYSQL_USER'),
            password: getEnv('MYSQL_PASS'),
            database: getEnv('MYSQL_DB'),
            connectionLimit: getEnv('MYSQL_POOL_LIMIT', 10),
            queueLimit: 0,
        }
    },
    e2e: {
        mode: 'asymmetric', // ['asymmetric', 'symmetric']
    },
    redis: {
        dsn: getEnv('REDIS_DSN')
    }
}