'use strict'

const test = require('tape')
const schema = require('./simple.json')
const Model = require('..')

test('simple test', function (t) {
  const model = Model(schema)
  let count = 0

  t.equal(Object.keys(model).length, 4, '`model` has the correct number of keys')

  // Handle update event
  model.on('update', 'str', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle update event
  model.on('update', 'num', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle update event
  model.on('update', 'bool', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle update event
  model.on('update', 'int', function (e) {
    console.log(e.event, e.path, e.result)
    count++
  })

  // Handle update event
  model.on('change', function (e) {
    console.log(e.event, e.path)
    count++
  })

  model.str = 'str'
  t.equal(count, 2)

  model.num = 4.2
  t.equal(count, 4)

  model.bool = true
  t.equal(count, 6)

  model.int = 42
  t.equal(count, 8)

  t.end()
})
