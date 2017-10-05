'use strict'

import * as jsonwebtoken from 'jsonwebtoken'
import * as config from 'config'
import * as uuid from 'uuid/v4'

import logger from '../logger'

import { encode } from '../utils/crypto'
import jwt from '../jwt'
import User from '../model/user'
import Thing from '../model/thing'

export default server => {

  server.get('/', (req, res) => {
    logger.info('GET / status=UP')
    res.status(200).json({ status: 'UP', message: 'Server Running' })
  })

  server.post('/users', jwt.authenticate(), (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password)
      res.status(400).json({ message: `Required username=${username} and password=${password}` })
    else {
      const newUser = {
        id: uuid(),
        username: username,
        password: encode(password)
      }
      logger.info(`Creating User=${JSON.stringify(newUser)}`)
      User.create(newUser)
        .then((user: User) => res.json(user))
        .catch(error => res.status(400).json(error))
    }
  })

  server.post('/auth', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    logger.info(`POST /auth username=${username} password=${password}`)

    if (!username || !password)
      res.status(400).json({ message: `Required username=${username} and password=${password}` })
    else {
      User.findOne({ username: username }, (err, user: User) => {
        logger.debug(`User.findOne return err=${err} user=${user}`)

        if (err || !user) res.status(401).json({ message: `Invalid User error=${err}` })
        else {
          if (user.password === encode(password)) {
            const payload = { id: user.id }
            const token = jsonwebtoken.sign(payload, config.get('jwt.secret'))
            res.json({ message: 'Success', token: token })
          } else {
            res.status(401).json({ message: 'Invalid Credentials' })
          }
        }
      })
    }
  })

  server.get('/secret', jwt.authenticate(), (req, res) => {
    res.status(200).json({ message: 'Secret Area', user: req.user })
  })

  //Add Thing
  server.post('/addThing', (req, res) => {
    const Name = req.body.thingName
    const Description = req.body.thingDescription
    console.log(req.body)
    if (!Name || !Description) {
      res.status(400).json({ message: 'thingName and thingDescription needed' })
    } else {
      let newThing = {
        thingId: uuid(),
        thingName: Thing,
        thingDescription: Description
      }
      Thing.create(newThing);
      res.status(200).json({ message: 'Thing added' })
    }
  });

  //get Thing
  server.get('/getThings', (req, res) => {
    /*User.find({}, (err, things: Thing) => {
      res.status(200).json(things)
    });*/
    //TODO
  });

  //update Thing
  server.put('/updateThing', (req, res) => {
    //TODO
  });

  //Delete Thing
  server.delete('/deleteThing', (req, res) => {
    //TODO
  });
  return server;
}
