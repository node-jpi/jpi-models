# jpi-models

Create observable models from JSON Schema.

Tiny library that takes a schema and produces a model that emits events when its data changes. Event handler registration supports a selector expression like DOM delegation where regex can be used to match dot notation paths.

Useful for helping to build front end browser applications where data changes need to monitored to perform UI updates.

## Installation

`npm i jpi-models`

```js
const Model = require('jpi-models')
```

## Example

Take a JSON schema:

```json
{
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": { "type": "string" },
    "lastName": { "type": "string" },
    "address": {
      "title": "Address",
      "type": "object",
      "properties": {
        "line1": { "type": "string" },
        "line2": { "type": "string" },
        "postcode": { "type": "string" },
        "latLong": {
          "title": "Lat Long",
          "type": "object",
          "properties": {
            "lat": { "type": "number" },
            "long": { "type": "number" }
          }
        }
      }
    },
    "age": {
      "type": "integer",
      "description": "Age in years",
      "minimum": 0
    },
    "comments": {
      "type": "array",
      "items": {
        "title": "Comment",
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "body": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

Create a model 

```js
test('readme test', function (t) {
  const model = Model(schema)
  let count = 0

  // Handle change events on `firstName`
  model.on('change', 'firstName', function (e) {
    // Fires on any change to `firstName`
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change events on `address.line1`
  model.on('change', 'address.line1', function (e) {
    // Fires on any change to `address.line1`
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle change events with a regex path selector
  model.on('change', /^address.latLong/, function (e) {
    // Fires on any change to keys that start with the
    // path `address.latLong`, in this case `lat` and `long`
    console.log(e.event, e.path, e.oldValue, e.newValue)
    count++
  })

  // Handle array change events. Supported events are
  // `push`, `pop`, `splice`, `sort`, `reverse`, `shift`, `unshift`
  model.on('push', 'comments', function (e) {
    // Fires on any change to keys that start with the
    // path `address.latLong`, in this case `lat` and `long`
    console.log(e.event, e.path, e.result)
    count++
  })

  // Handle all update events
  model.on('update', function (e) {
    // Fires on all updates
    console.log(e.event, e.path)
    count++
  })

  model.firstName = 'firstName'
  t.equal(count, 2)

  model.firstName = 'Liz Windsor'
  t.equal(count, 4)

  model.address.line1 = 'Buckingham Palace'
  t.equal(count, 6)

  model.address.latLong.lat = 1.1
  t.equal(count, 8)

  model.address.latLong.long = 1.1
  t.equal(count, 10)

  const comment = model.comments.create()
  model.comments.push(comment)
  t.equal(count, 12)

  comment.title = 'Title'
  t.equal(count, 13)

  /**
   * SPECIAL NOTE ON ARRAYS
   *
   * Arrays have 2 special functions `create()` and `set(index, value)`.
   * You *must* use these to construct a new array item instance and to update
   * an existing item by index. Using square brack assignment by index
   * e.g. arr[1] = 'foo', will not emit change events.
   */
  const comment2 = model.comments.create()
  model.comments.set(0, comment2)
  t.equal(count, 14)

  comment2.title = 'Title2'
  t.equal(count, 15)

  t.end()
})
```

## Known Shortcomings

This library was written to serve a specific purpose in a demo application.
There are probably loads of issues with it but it's only supposed to be a proof of concept.

The library itself is only a few lines of code and if you stay within it's capabilities outlined in the `test` folder you should be fine.

Some known issues:

## Data links & attatchments
