<h1 align="center">We MobX - 在微信小程序中加入 MobX</h1>

<div align="center">以最简洁的调用实现微信小程序与 MobX 之间的绑定</div>

####

> MobX 是一个简单、可扩展的状态管理方案。关于 MobX 的介绍与使用请移步 [MobX](https://mobx.js.org/README.html)

## 📦 安装

```
npm install mobx we-mobx
```

或者

```
yarn add mobx we-mobx
```

## 📖 API

#### `provider(stores)(options)`

为小程序传递 stores 的全局引用，options 为 `App()` 的选项参数。

```ts
import { provider } from 'we-mobx'
import stores from './store/index'

const App = provider(stores)

App<IAppOption>({
  ...
})
```

#### `observer.page(options)(observedStores)`

#### `observer.component(options)(observedStores)`

options 为页面或组件的选项参数，observedStores 为需被监听的 stores 对象，调用后会完成页面和组件的声明。

单独使用时需要调用 observe 完成页面声明，此时需要将 store 对象的直接引用作为参数 observedStores 传入。在 inject 中使用时则不需要，observedStores 的传递与 observe 的调用会在 inject 内部进行。

```ts
import { observer } from 'we-mobx'

const observe = observer.page({
  ...
})

observe({ storeA, storeB })
```

#### `inject.page(...storeName[])(createObserver)`

为页面注入需被监听的 store。调用前需要使用 provider 将 stores 全局引入。

createObserver 的参数为 stores 的直接引用，返回值为 observer 函数调用返回的 observe 函数。此时无需再次调用 observe 函数指定监听对象，inject 会自动完成需被监听的 stores 的注入。

```ts
import { inject } from 'we-mobx'

inject<Stores>('storeA', 'storeB')(({ storeA }) =>
  observer.page({
    ...
  })
)
```

## 🏀 使用

#### 定义一个 store

```ts
import { observable, computed, action } from 'mobx'

class Todo {
  id = Math.random()

  @observable title = ''
  @observable completed = false

  constructor(title: string) {
    this.title = title
  }
}

class TodoStore {
  @observable todos: Todo[] = []

  @action
  add(title: string) {
    this.todos.push(new Todo(title))
  }

  @action
  remove(id: number) {
    this.todos.splice(
      this.todos.findIndex(todo => todo.id === id),
      1
    )
  }

  @action
  toggle(id: number) {
    const todo = this.todos.find(item => item.id === id)

    if (todo) {
      todo.completed = !todo.completed
    }
  }
}

export default new TodoStore()
```

#### 传递全局 stores 并在页面中注入指定的 store

```ts
import { provider } from 'we-mobx'
import { todoStore } from './store/index'

const App = provider({ todoStore })

App<IAppOption>({
  ...
})
```

```ts
import { inject } from 'we-mobx'

inject.page<Stores>('todoStore')(({ todoStore }) =>
  observer.page({
    count: 0,

    addTodo() {
      todoStore.add('My Todo ' + ++this.count)
    },

    removeTodo(e: any) {
      const { id } = e.currentTarget.dataset
      todoStore.remove(id)
    },

    toggleCompleted(e: any) {
      const { id } = e.currentTarget.dataset
      todoStore.toggle(id)
    },
  })
)
```

#### 如果只使用 observer，则需要再次调用以传入需监听的 store 对象

```ts
import { observer } from 'we-mobx'
import { todoStore } from '../../store/index'

const observe = observer.page({
  count: 0,

  addTodo() {
    todoStore.add('My Todo ' + ++this.count)
  },

  removeTodo(e: any) {
    const { id } = e.currentTarget.dataset
    todoStore.remove(id)
  },

  toggleCompleted(e: any) {
    const { id } = e.currentTarget.dataset
    todoStore.toggle(id)
  },
})

observe({ todoStore })
```

#### store 中的状态会被映射至 data 中，直接在 wxml 中引用

```html
<view wx:for="{{ todoStore.todos }}" wx:key="id" data-id="{{ item.id }}" bindtap="toggleCompleted">
  <view>
    <view>
      <text>{{ item.title }}</text>
    </view>
    <checkbox checked="{{ item.completed }}"></checkbox>
  </view>
</view>

<button bindtap="addTodo">添加</button>
```

## 🌟 FAQ

### 应该使用 provider & inject 的方式，还是直接使用 observer ？

推荐 provider & inject 这样的引入方式。如果只想在特定的页面引入 store，或是偏好更灵活直观的调用方式，可以只使用 observer。

### 在 provider 或 observer 传入的 stores 结构应该是怎样的？

在 provider 中需要传入全部 stores 的引用，并且需遵循 `stores: { storeA, storeB }` 这样的格式。

在 observer 中传递的结构与 provider 中类似，但只需传递需被监听的 store。

## 📄 License

[MIT](https://github.com/clancysong/we-mobx/blob/master/LICENSE)
