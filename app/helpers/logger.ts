// deno-lint-ignore-file no-explicit-any
import chalk from 'chalk'
import moment from 'moment'

const isDev = Deno.env.get('NODE_ENV')
const info = chalk.cyan
const warn = chalk.yellow
const success = chalk.green
const error = chalk.red

export const getTime = () => {
    return moment().format('YYYY-MMM-DD HH:mm:ss')
}

export const logInfo = function (...msg: Array<any>) {
    console.log(info(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[INFO]', ...msg)
}
export const logWarning = function (...msg: Array<any>) {
    console.log(warn(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[WARN]', ...msg)
}
export const logSuccess = function (...msg: Array<any>) {
    console.log(success(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[SUCCESS]', ...msg)
}
export const logError = function (...msg: Array<any>) {
    console.log(error(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[ERR]', ...msg)
}

export const debugInfo = function (...msg: Array<any>) {
    if (!isDev) return false
    logInfo(...msg)
}
export const debugWarning = function (...msg: Array<any>) {
    if (!isDev) return false
    logWarning(...msg)
}
export const debugSuccess = function (...msg: Array<any>) {
    if (!isDev) return false
    logSuccess(...msg)
}
export const debugError = function (...msg: Array<any>) {
    if (!isDev) return false
    logError(...msg)
}