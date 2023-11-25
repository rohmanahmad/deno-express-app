import type MysqlProvider from '../providers/mysql.ts'
import type RedisProvider from '../providers/redis.ts'
import type E2E from '../providers/e2e.ts'
import type MongoDBProvider from '../providers/mongodb.ts'

export type Providers = {
    mysql: MysqlProvider
    redis: RedisProvider
    e2e: E2E
    mongodb: MongoDBProvider
}
