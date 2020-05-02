import { autorun, IReactionDisposer } from 'mobx'
import { is } from './utils'
import diff from './diff'

const create = {
  page: (stores: AnyObject, mapper: Function, options: PageOptions) => {
    let dispose: IReactionDisposer

    const { data = {}, onLoad, onUnload } = options

    return Page({
      ...options,
      data: { ...data, ...mapper(stores) },

      onLoad(query) {
        dispose = autorun(() => {
          if (this.data) {
            const diffs: AnyObject = diff({ ...this.data, ...mapper(stores) }, this.data)

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
  },

  component(stores: AnyObject, mapper: Function, options: ComponentOptions) {
    let dispose: IReactionDisposer

    const { data = {}, attached, detached } = options

    return Component({
      ...options,
      data: { ...data, ...mapper(stores) },

      attached() {
        dispose = autorun(() => {
          if (this.data) {
            const diffs: AnyObject = diff({ ...this.data, ...mapper(stores) }, this.data)

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
  },
}

export default create
