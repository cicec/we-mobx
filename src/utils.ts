export const is = {
  fun: (a: unknown): a is Function => typeof a === 'function',
  arr: (a: unknown): a is [] => Array.isArray(a),
  obj: (a: unknown): a is AnyObject => Object.prototype.toString.call(a) === '[object Object]',
  set: (a: unknown): a is Set<any> => Object.prototype.toString.call(a) === '[object Set]',
  map: (a: unknown): a is Map<any, any> => Object.prototype.toString.call(a) === '[object Map]',
}

export const toData = (source: any): any => {
  if (is.arr(source)) {
    return source.map((item) => toData(item))
  }

  if (is.set(source)) {
    return Array.from(source).map((item) => toData(item))
  }

  if (is.obj(source)) {
    const target: AnyObject = {}

    for (const key in source) {
      target[key] = toData(source[key])
    }

    return target
  }

  if (is.map(source)) {
    const obj = Object.fromEntries(source)
    const target: AnyObject = {}

    Object.getOwnPropertyNames(obj).forEach((key) => {
      target[key] = toData(obj[key])
    })

    return target
  }

  return source
}
