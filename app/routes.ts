import { RouteGroupInterface } from './interfaces/route.ts'
import accountRoutes from './modules/account/routes.ts'

const activeRoutes: RouteGroupInterface = {
    accountRoutes,
}

export default activeRoutes
