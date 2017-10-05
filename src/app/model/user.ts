'use strict'

import { Document, model, Model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

interface User extends Document {
  id: string,
  password: string,
  username: string
}

const User = model<User>('User', UserSchema)

export default User