const mapStores = <TStores extends AnyObject>(names: (keyof TStores)[]) => (source: TStores) => {
  const target: TStores = {} as TStores

  names.forEach(key => {
    if (source && source[key]) {
      target[key] = source[key]
    }
  })

  return target
}

const inject = <TStores extends AnyObject>(...storeNames: (keyof TStores)[]) => (
  createObserver: (stores: TStores) => (observedStores: AnyObject) => void | string
) => {
  const stores = getApp().stores ?? {}
  const observedStores = mapStores(storeNames)(stores)

  return createObserver(stores)(observedStores)
}

export default inject
