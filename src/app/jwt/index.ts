'use strict'

import * as passport from 'passport'

import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'

import * as jwt from 'jsonwebtoken'
import * as config from 'config'

import logger from '../logger'
import User from '../model/user'
import option from '../utils/option'

const jwtHeader = option(config.get('jwt.header'))
  .orElse('Authorization')

const getToken = header =>
  option(header)
    .filter(header => header.split(' ')[0] === 'Bearer')
    .map(header => header.split(' ')[1])
    .map(header => header.trim())
    .orElse('');
            
const fromRequest = (req): string => {
  const header = jwtHeader.toString().toLowerCase()
  const reqHeader = req.headers[header];
  const token = getToken(reqHeader)
  logger.verbose(`Geting token from header=${header} token=${token}`)
  return token
}

const callback = () => (payload, next) => {
  logger.debug(`Passport Verify Callback payload="${JSON.stringify(payload)}"`)

  User.findOne({ id: payload.id }, (err, user: User) => {
    logger.debug(`Passport Verify User="${JSON.stringify(user)}" error="${JSON.stringify(err)}"`)

    if (err) next(err)
    else next(false, user)
  })
}

const strategy = () => new Strategy({
  jwtFromRequest: fromRequest,
  secretOrKey: config.get('jwt.secret')
}, callback())

export interface VerifyCallback {
  (payload, next): void
}

passport.use(strategy())

export default {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false })
}