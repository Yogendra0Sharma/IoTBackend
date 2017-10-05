'use strict'

import * as config from 'config'

import mongo from './mongo'
import server from './server'
import routes from './routes'
import logger from './logger'

import User from './model/user'
import option from './utils/option'

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost'
process.env.PORT = process.env.PORT || config.get('server.port') || '3000'

const info = () => logger.info(`Server Started at ${process.env.NODE_ENV}:${process.env.PORT}`)

export default 
  option(mongo.connect())
    .flatmap(connected => server())
    .map(server => routes(server))
    .map(server => server.listen(process.env.PORT, info))
