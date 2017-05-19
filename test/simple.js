'use strict'

const test = require('tape')
const schema = require('./simple.json')
const Model = require('..')

test('simple test', function (t) {
  const model = Model(schema)
  let count = 0

  t.equal(Object.keys(model).length, 4, '`model` has the correct number of keys')

  // Handle change event
  model.on('change', 'str', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change event
  model.on('change', 'num', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change event
  model.on('change', 'bool', function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change event
  model.on('change', 'int', function (e) {
    console.log(e.event, e.path, e.result)
    count++
  })

  // Handle change event
  model.on('update', function (e) {
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
