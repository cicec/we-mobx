import { autorun, IReactionDisposer } from 'mobx'
import { is, toData } from './utils'
import diff from './diff'

const observer = {
  page: <TData extends DataOption, TCustom extends CustomOption>(
    options: PageOptions<TData, TCustom>
  ) => {
    let dispose: IReactionDisposer

    const { data = {}, onLoad, onUnload } = options

    return (observedStores: AnyObject = {}) =>
      Page({
        ...options,
        data: { ...data, ...toData(observedStores) },

        onLoad(query) {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff({ ...this.data, ...toData(observedStores) }, this.data)

              this.setData(diffs)
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

  component: <
    TData extends DataOption,
    TProperty extends PropertyOption,
    TMethod extends MethodOption
  >(
    options: ComponentOptions<TData, TProperty, TMethod>
  ) => {
    let dispose: IReactionDisposer

    const { data = {}, attached, detached } = options

    return (observedStores: AnyObject = {}) =>
      Component({
        ...options,
        data: { ...data, ...toData(observedStores) },

        attached() {
          dispose = autorun(() => {
            if (this.data) {
              const diffs: AnyObject = diff({ ...this.data, ...toData(observedStores) }, this.data)

              this.setData(diffs)
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

export default observer
