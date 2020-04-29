import { autorun, toJS, IReactionDisposer } from 'mobx'
import diff from './diff'

type ComponentOptions = WechatMiniprogram.Component.Options<AnyObject, AnyObject, AnyObject>
type PageOptions = WechatMiniprogram.Page.Options<AnyObject, AnyObject>

const isFunc = (a: unknown): a is Function => typeof a === 'function'

const toEntireJS = (source: AnyObject) => {
  const target: AnyObject = {}

  Object.getOwnPropertyNames(source).forEach((key) => {
    target[key] = toJS(source[key])
  })

  return target
}

const observer = {
  page(store: AnyObject) {
    return (options: PageOptions) => {
      let dispose: IReactionDisposer

      const data = options.data || {}
      const onLoad = options.onLoad
      const onUnload = options.onUnload

      return Page({
        ...options,
        data: { ...data, store: toEntireJS(store) },

        onLoad(query) {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff(toEntireJS(store), this.data.store)

              for (const key in diffs) {
                this.setData({ ['store.' + key]: diffs[key] })
              }
            }
          })

          if (isFunc(onLoad)) onLoad.call(this, query)
        },

        onUnload() {
          if (dispose) dispose()

          if (isFunc(onUnload)) onUnload.call(this)
        },
      })
    }
  },

  component(store: AnyObject) {
    return (options: ComponentOptions) => {
      let dispose: IReactionDisposer

      const data = options.data || {}
      const attached = options.attached
      const detached = options.detached

      return Component({
        ...options,
        data: { ...data, store: toEntireJS(store) },

        attached() {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff(toEntireJS(store), this.data.store)

              for (const key in diffs) {
                this.setData({ ['store.' + key]: diffs[key] })
              }
            }
          })

          if (isFunc(attached)) attached.call(this)
        },

        detached() {
          if (dispose) dispose()

          if (isFunc(detached)) detached.call(this)
        },
      })
    }
  },
}

export default observer
