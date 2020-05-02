import { isObservable, toJS } from 'mobx'

export const is = {
  fun: (a: unknown): a is Function => typeof a === 'function',
  obj: (a: unknown): a is AnyObject =>
    Object.prototype.toString.call(a) === '[object Object]',
}

const mapProps = (source: AnyObject) => (operation: Function) => {
  const target: AnyObject = {}

  Object.getOwnPropertyNames(source)
    .filter((key) => !is.fun(source[key]))
    .forEach((key) => {
      target[key] = operation(source[key])
    })

  return target
}

export const toData = (source: any) => {
  if (is.obj(source)) {
    return mapProps(source)(isObservable(source) ? toJS : toData)
  }

  return source
}
