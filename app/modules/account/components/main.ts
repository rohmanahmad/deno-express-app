// Auth
import authLogin from './auth/login.ts'
import authLogout from './auth/logout.ts'
import authRefreshToken from './auth/refresh-token.ts'

// Profile
import profileInfo from './profile/info.ts'
import profileRegister from './profile/register.ts'
import profileUpdate from './profile/update.ts'

export default [
  authLogin,
  authLogout,
  authRefreshToken,
  profileInfo,
  profileRegister,
  profileUpdate,
]