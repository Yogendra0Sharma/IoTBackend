'use strict'

import * as mongoose from 'mongoose'

import * as config from 'config'

const MongoDbError = Error

const host = config.get('db.host')

const options = { 
  useMongoClient: true, 
  promiseLibrary: global.Promise 
}

export { MongoDbError }

export default {
  connect: () => mongoose.connect(`mongodb://${host}/test`, options, error => {
    if (error) throw new MongoDbError(`MongoDB Error="${error}"`)
  }),

  isReady: () => mongoose.connection.readyState
}