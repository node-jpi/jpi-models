'use strict'

module.exports = function (fn) {
  const arr = []

  /**
   * Proxied array mutators methods
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  const pop = function () {
    const result = Array.prototype.pop.apply(arr)

    fn('pop', arr, {
      value: result
    })

    return result
  }
  const push = function () {
    const result = Array.prototype.push.apply(arr, arguments)

    fn('push', arr, {
      value: result
    })

    return result
  }
  const shift = function () {
    const result = Array.prototype.shift.apply(arr)

    fn('shift', arr, {
      value: result
    })

    return result
  }
  const sort = function () {
    const result = Array.prototype.sort.apply(arr, arguments)

    fn('sort', arr, {
      value: result
    })

    return result
  }
  const unshift = function () {
    const result = Array.prototype.unshift.apply(arr, arguments)

    fn('unshift', arr, {
      value: result
    })

    return result
  }
  const reverse = function () {
    const result = Array.prototype.reverse.apply(arr)

    fn('reverse', arr, {
      value: result
    })

    return result
  }
  const splice = function () {
    if (!arguments.length) {
      return
    }

    const result = Array.prototype.splice.apply(arr, arguments)

    fn('splice', arr, {
      value: result,
      removed: result,
      added: Array.prototype.slice.call(arguments, 2)
    })

    return result
  }

  /**
   * Proxy all Array.prototype mutator methods on this array instance
   */
  arr.pop = arr.pop && pop
  arr.push = arr.push && push
  arr.shift = arr.shift && shift
  arr.unshift = arr.unshift && unshift
  arr.sort = arr.sort && sort
  arr.reverse = arr.reverse && reverse
  arr.splice = arr.splice && splice

  /**
   * Special update function since we can't detect
   * assignment by index e.g. arr[0] = 'something'
   */
  arr.update = function (index, value) {
    const oldValue = arr[index]
    const newValue = arr[index] = value

    fn('update', arr, {
      index: index,
      value: newValue,
      oldValue: oldValue
    })

    return newValue
  }

  return arr
}
