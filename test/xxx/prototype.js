'use strict'

const test = require('tape')
const assign = require('assign-deep')

function factory (schema) {
  const properties = schema.properties
  const keys = Object.keys(properties)
  const descriptors = {}

  keys.forEach(key => {
    const prop = properties[key]
    const dflt = prop.default
    let lazy = false
    let val

    if (prop.properties) {
      lazy = function () {
        lazy = false
        const ChildModel = factory(prop)
        const childModel = new ChildModel(dflt)
        return childModel
      }
    } else {
      val = dflt
    }

    descriptors[key] = {
      get () {
        if (lazy) {
          val = lazy()
        }
        return val
      },
      set (value) {
        val = value
      },
      enumerable: true
    }
  })

  function Ctor (data) {
    Object.defineProperties(this, descriptors)
    if (data) {
      assign(this, data)
    }
  }
  Ctor.prototype.baseFn = function () {
    console.log('ayay')
  }

  return Ctor
}

// test('Prototype test 1', function (t) {
//   const schema = require('./simple.json')
//   const Model = factory(schema)
//   const model = new Model()

//   t.equal(model.str, undefined)
//   t.equal(model.int, 42)
//   t.equal(Object.keys(model).length, 4)
//   console.log(model)
//   console.log(JSON.stringify(model))
//   t.end()
// })

test('Prototype test 2', function (t) {
  const schema = require('./subdoc.json')
  const Model = factory(schema)
  const model = new Model()

  t.equal(model.str, undefined)
  t.equal(model.int, 42)
  t.equal(Object.keys(model).length, 5)
  console.log(model)
  console.log(JSON.stringify(model))
  model.address.latLong.lat = 2
  t.end()
})
