'use strict'

import { Document, model, Model, Schema } from 'mongoose';

const ThingSchema: Schema = new Schema({
  thingId: {
    type: String,
    required: true,
    unique: true
  },
  thingName: {
    type: String,
    required: true
  },
  thingDescription: {
    type: String,
    required: true
  }
})

interface Thing extends Document {
  thingId: string,
  thingName: string,
  thingDescription: string
}

const Thing = model<Thing>('Thing', ThingSchema)

export default Thing
