import MysqlClient from 'mysql2/promise'

class MysqlProvider {
    constructor(config) {
        this.config = config // config akan menyesuaikan nama file provider >> disini diambil dari config.providers.mongodb :: Lihat: [server.js](registerProviders)
        this.pool = null
    }

    async boot() {
        try {
            this.pool = new MysqlClient.createPool(this.config.connection)
            return this
        } catch (err) {
            throw err
        }
    }

    runQuery(sql, params) {
        const matches = sql.match(/\{(.*?)\}/ig)
        let mapParams = []
        let mapSql = sql.trim()
        if (matches) {
            for (const x of matches) {
                const key = x.replace('{', '').replace('}', '')
                mapSql = mapSql.replace(x, '?')
                mapParams.push(params[key])
            }
        }
        mapSql = mapSql.replace(/\;/g, '')
        return new Promise((resolve, reject) => {
            this.pool.execute(mapSql, mapParams, (err, rows, fields) => {
                if (err) return reject(err)
                resolve({rows, fields, compiled: {sql: mapSql, params: mapParams}})
            })
        })
    }

    async close() {
        this.pool.getConnection(function (err, conn) {
            if (conn) this.pool.releaseConnection(conn)
        })
    }
}

export default MysqlProvider