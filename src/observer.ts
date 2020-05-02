import create from './create'
import { toData } from './utils'

const observer = {
  page: (stores: AnyObject) => (options: PageOptions) =>
    create.page(stores, toData, options),

  component: (stores: AnyObject) => (options: ComponentOptions) =>
    create.component(stores, toData, options),
}

export default observer
