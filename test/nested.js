'use strict'

const test = require('tape')
const schema = require('./nested.json')
const Model = require('..')

test('nested test', function (t) {
  const model = Model(schema)
  let count = 0

  // Handle push events into comments array
  model.on('push', 'comments', function (e) {
    console.log(e.event, e.path, e.result)
    count++
  })

  // Handle push events into comments.notes array
  model.on('push', 'comments.notes', function (e) {
    console.log(e.event, e.path, e.result)
    count++
  })

  // Handle all update events
  model.on('update', function (e) {
    console.log(e.event, e.path, e.result || e.newValue)
    count++
  })

  const comment = model.comments.create()
  comment.title = 'title'
  t.equal(count, 1)

  model.comments.push(comment)
  t.equal(count, 3)

  const note = comment.notes.create()
  comment.notes.push(note)
  t.equal(count, 5)

  note.message = 'msg'
  t.equal(count, 6)

  t.end()
})
