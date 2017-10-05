'use strict'

import * as express from 'express'
import * as parser from 'body-parser'

import jwt from '../jwt'

import logger from '../logger'
import option from '../utils/option'

export const ServerError = Error

export default () => 
  option(express())
    .map(server => server.use(jwt.initialize()))
    .map(server => server.use(parser.json()))
    .map(server => server.use(parser.urlencoded({
      extended: true
    })))