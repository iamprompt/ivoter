import { auth } from './getAuthInstance'

export const getUserAndVerifyAuth = async (
  authorizationHeader: string,
  allowedRoles: string[] = ['user'],
  ignoreAuthCheck = false
) => {
  const extractedToken = /Bearer (.+)/.exec(authorizationHeader)?.[1] ?? ''
  try {
    const decodedToken = await auth.verifyIdToken(extractedToken)

    const userAuth = await auth.getUser(decodedToken.uid)
    const role = userAuth.customClaims?.role ?? 'user'

    if (ignoreAuthCheck || allowedRoles.includes(role)) {
      return userAuth
    } else {
      throw new Error('Unauthorized')
    }
  } catch (error) {
    throw new Error('Unauthorized')
  }
}
