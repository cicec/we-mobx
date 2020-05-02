import create from './create'
import { toData } from './utils'

const mapStores = (names: string[]) => (source: AnyObject) => {
  const target: AnyObject = {}

  names.forEach((key) => {
    if (source && source[key]) {
      target[key] = toData(source[key])
    }
  })

  return target
}

const inject = {
  page: (...storeNames: string[]) => (
    createOptions: (stores: AnyObject) => PageOptions
  ) =>
    create.page(getApp().stores, mapStores(storeNames), createOptions(getApp().stores)),

  component: (...storeNames: string[]) => (
    createOptions: (stores: AnyObject) => ComponentOptions
  ) =>
    create.component(getApp().stores, mapStores(storeNames), createOptions(getApp().stores)),
}

export default inject
