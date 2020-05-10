export const is = {
  fun: (a: unknown): a is Function => typeof a === 'function',
  arr: (a: unknown): a is [] => Array.isArray(a),
  obj: (a: unknown): a is AnyObject => Object.prototype.toString.call(a) === '[object Object]'
}

export const toData = (source: any): any => {
  if (is.arr(source)) {
    return source.map((item) => toData(item))
  }

  if (is.obj(source)) {
    const target: AnyObject = {}

    Object.getOwnPropertyNames(source).forEach((key) => {
      target[key] = toData(source[key])
    })

    return target
  }

  return source
}
