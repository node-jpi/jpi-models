'use strict'

const test = require('tape')
const schema = require('./schema.json')
const Model = require('..')

test('regex test', function (t) {
  const model = Model(schema)
  let count = 0

  // Handle change to any path that starts with `address`
  model.on('change', /^address/, function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change to any path that starts with `address.latLong`
  model.on('change', /^address.latLong/, function (e) {
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  model.address.line1 = 'line 1'
  t.equal(count, 1)

  model.address.line2 = 'line 2'
  t.equal(count, 2)

  model.address.postcode = 'AB1 1BA'
  t.equal(count, 3)

  model.address.latLong.lat = 1
  t.equal(count, 5)

  model.address.latLong.long = 1
  t.equal(count, 7)

  t.end()
})
