import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient

class MongoDBProvider {
    constructor(config) {
        this.config = config // config akan menyesuaikan nama file provider >> disini diambil dari config.providers.mongodb :: Lihat: [server.js](registerProviders)
        this.client = null
    }

    async boot() {
        try {
            this.client = new MongoClient(this.config.dsn)
            await this.client.connect()
            const db = this.client.db()
            db.collection('restart').insertOne({restart_at: new Date(), env: process.env})
            return db
        } catch (err) {
            throw err
        }
    }

    async close() {
        await this.client.close()
    }
}

export default MongoDBProvider