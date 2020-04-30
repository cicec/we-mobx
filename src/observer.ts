import { autorun, toJS, isObservable, IReactionDisposer } from 'mobx'
import diff from './diff'

type ComponentOptions = WechatMiniprogram.Component.Options<AnyObject, AnyObject, AnyObject>
type PageOptions = WechatMiniprogram.Page.Options<AnyObject, AnyObject>

const is = {
  fun: (a: unknown): a is Function => typeof a === 'function',
  obj: (a: unknown): a is AnyObject => Object.prototype.toString.call(a) === '[object Object]',
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

const toData = (source: any) => {
  if (is.obj(source)) {
    return mapProps(source)(isObservable(source) ? toJS : toData)
  }

  return source
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

          if (is.fun(onLoad)) onLoad.call(this, query)
        },

        onUnload() {
          if (dispose) dispose()

          if (is.fun(onUnload)) onUnload.call(this)
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

          if (is.fun(attached)) attached.call(this)
        },

        detached() {
          if (dispose) dispose()

          if (is.fun(detached)) detached.call(this)
        },
      })
    }
  },
}

export default observer
