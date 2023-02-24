import { NextFunction, Request, Response } from 'express'

import { getSpecificHostAuth, IOptions, isAuthNeeded } from './helper'

module.exports = function basicAuthMiddleware(username: string, password: string, options?: IOptions) {
  return (req: Request, res: Response, nextFn: NextFunction) => {
    if (!isAuthNeeded(req, options)) {
      return nextFn()
    }

    const host = req.get('host')

    const auth = getSpecificHostAuth(host, options) || { username, password }

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [enteredUsername, enteredPassword] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (
      !enteredUsername ||
      !enteredPassword ||
      enteredUsername !== auth.username ||
      enteredPassword !== auth.password
    ) {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication required.')
      return false
    }

    return nextFn()
  }
}
