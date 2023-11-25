import { createClient } from 'redis'

class RedisProvider {
    constructor(config) {
        this.config = config // config akan menyesuaikan nama file provider >> disini diambil dari config.providers.redis :: Lihat: [server.js](registerProviders)
        this.client = null
    }

    async boot() {
        try {
            if (!this.client) {
                this.client = new createClient({ url: this.config.dsn })
                await this.client.connect()
            }
            return this.client
        } catch (err) {
            throw err
        }
    }

    async close() {
        await this.client.disconnect()
    }
}

export default RedisProvider