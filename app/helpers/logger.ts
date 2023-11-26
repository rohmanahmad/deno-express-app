import chalk from 'chalk'
import moment from 'moment'

const isDev = Deno.env.get('NODE_ENV')
const info = chalk.cyan
const warn = chalk.yellow
const success = chalk.green
const error = chalk.red

type LogValueInterface = string | number | Array<string> | object | boolean

export const getTime = (): string => {
    return moment().format('YYYY-MMM-DD HH:mm:ss')
}

export const logInfo = function (...msg: Array<LogValueInterface>): void {
    console.log(info(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[INFO]', ...msg)
}
export const logWarning = function (...msg: Array<LogValueInterface>): void {
    console.log(warn(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[WARN]', ...msg)
}
export const logSuccess = function (...msg: Array<LogValueInterface>): void {
    console.log(
        success(getTime() + ' >>'),
        `[PID: ${Deno.pid}]`,
        '[SUCCESS]',
        ...msg,
    )
}
export const logError = function (...msg: Array<LogValueInterface>): void {
    console.log(error(getTime() + ' >>'), `[PID: ${Deno.pid}]`, '[ERR]', ...msg)
}

export const log = function (...msg: Array<LogValueInterface>): void {
    logInfo(...msg)
}

export const debugInfo = function (...msg: Array<LogValueInterface>): void {
    if (isDev) logInfo(...msg)
}
export const debugWarning = function (...msg: Array<LogValueInterface>): void {
    if (isDev) logWarning(...msg)
}
export const debugSuccess = function (...msg: Array<LogValueInterface>): void {
    if (isDev) logSuccess(...msg)
}
export const debugError = function (...msg: Array<LogValueInterface>): void {
    if (isDev) logError(...msg)
}
