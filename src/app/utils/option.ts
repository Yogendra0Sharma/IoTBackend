'use strict'

const option = (value) => new Option(value)

class Option {
  nextOption: Option

  value: any

  constructor (value: any) {
    if (!value) this.value = undefined
    else this.value = value
  }

  _and () {
    return (another: any): Option => {
      return this.flatmap((opThis: Option) => {
        const anotherOption = option(another)
        anotherOption.nextOption = opThis
        return anotherOption
      }).orElse(None)
    }
  }

  and = this._and()

  _or () {
    return (another: any): Option => {
      return this.flatmap((opThis: Option) => {
        const anotherOption = option(another)
        anotherOption.nextOption = opThis
        return anotherOption
      }).orElse(this)
    }
  }

  or = this._or()

  _empty () {
    return () => None
  }

  empty = this._empty()

  _get () {
    return () => this.value
  }

  get = this._get()

  _isEmpty () {
    return () => this.value === undefined
  }

  isEmpty = this._isEmpty()

  _orElse () {
    return (another: any) => this.isEmpty() ? another : this.get()
  }

  orElse = this._orElse()

  _map () {
    return f => this.isEmpty() ? None : new Option(f(this.get()))
  }

  map = this._map()

  _flatmap () {
    return f => this.isEmpty() ? None : f(this.get())
  }

  flatmap = this._flatmap()

  _filter () {
    return p => (this.isEmpty() || p(this.get())) ? this : None
  }

  filter = this._filter()
}

export default option

const None = new Option(undefined)
