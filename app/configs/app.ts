import moment from 'moment'

export default {
    node_env: Deno.env.get('NODE_ENV'),
    server: {
        host: Deno.env.get('APP_HOST'),
        port: Deno.env.get('APP_PORT'),
        version: '1.0.0',
        last_restart: moment().format('YYYY-MMM-DD HH:mm'),
        author: 'rohmanahmad<rohmanwebid@gmail.com>',
    },
}
