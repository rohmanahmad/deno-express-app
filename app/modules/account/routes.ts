import { RouteListInterface } from '../../interfaces/route.ts'
import components from './components/main.ts'

const AccountRoutes: RouteListInterface = {
    name: 'account-routes',
    prefix: '/account',
    list: components,
}

export default AccountRoutes
