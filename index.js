'use strict'

const array = require('./array')

function model (schema) {
  const paths = []
  // const root = ee({})
  const callbacks = {}

  const root = Object.create({}, {
    on: {
      value: function (event, selector, fn) {
        if (typeof selector === 'function') {
          fn = selector
          selector = undefined
        }

        if (!callbacks[event]) {
          callbacks[event] = new Map()
        }

        callbacks[event].set(selector, fn)
      }
    }
  })

  function emit (event, selector, details) {
    if (callbacks[event]) {
      const map = callbacks[event]

      map.forEach(function (value, key) {
        if ((!key && !selector) || (key === selector)) {
          value.call(root, details)
        } else if (key instanceof RegExp && key.test(selector)) {
          value.call(root, details)
        }
      })
    }
  }

  function apply (schema, ctx, path) {
    if (schema.properties) {
      paths.push(path)
      path = paths.slice(1).join('.')

      const props = schema.properties

      for (let key in props) {
        const prop = props[key]

        if (prop.properties) {
          const child = {}
          apply(prop, child, key)
          ctx[key] = child
          paths.pop()
        } else if (prop.items) {
          const child = array(function (event, arr, result) {
            const name = path ? path + '.' + key : key
            emit(event, name, {
              event: event,
              key: key,
              path: name,
              context: arr,
              result: result
            })

            emit('update', null, {
              event: event,
              key: key,
              path: name,
              context: arr,
              result: result
            })
          })
          child.create = function () {
            const item = {}
            apply(prop.items, item, path ? path + '.' + key : key)
            paths.pop()
            return item
          }
          ctx[key] = child
        } else {
          let val = prop.default

          Object.defineProperty(ctx, key, {
            get () {
              return val
            },
            set (value) {
              const oldValue = val

              val = value

              const name = path ? path + '.' + key : key
              emit('change', name, {
                event: 'change',
                key: key,
                path: name,
                context: ctx,
                oldValue: oldValue,
                newValue: value
              })

              emit('update', null, {
                event: 'update',
                key: key,
                path: name,
                context: ctx,
                oldValue: oldValue,
                newValue: value
              })
            },
            enumerable: true
          })
        }
      }
    }
  }

  apply(schema, root, '')

  Object.freeze(root)

  return root
}

module.exports = model
