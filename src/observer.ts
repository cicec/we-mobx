import { autorun, toJS, IReactionDisposer } from 'mobx'
import diff from './diff'

type ComponentOptions = WechatMiniprogram.Component.Options<AnyObject, AnyObject, AnyObject>
type PageOptions = WechatMiniprogram.Page.Options<AnyObject, AnyObject>

const isFunc = (a: unknown): a is Function => typeof a === 'function'

const toData = (source: AnyObject) => {
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

      const { data = {}, onLoad, onUnload } = options

      return Page({
        ...options,
        data: { ...data, ...toData(store) },

        onLoad(query) {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff({ ...this.data, ...toData(store) }, this.data)

              for (const key in diffs) {
                if (key) this.setData({ [key]: diffs[key] })
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

      const { data = {}, attached, detached } = options

      return Component({
        ...options,
        data: { ...data, ...toData(store) },

        attached() {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff({ ...this.data, ...toData(store) }, this.data)

              for (const key in diffs) {
                if (key) this.setData({ [key]: diffs[key] })
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
