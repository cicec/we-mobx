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

provider(stores)({
  ...
})
```

#### `inject.page(...storeName[])(createOptions)`

为页面注入需被监听的 store。stores 的直接引用会通过 createOptions 的参数传入，需返回 `Page()` 的选项参数。

```ts
inject.page('storeA', 'storeB')(({ storeA, storeB }) => ({
  onLoad() {
    storeA.count
  },

  ...
}))
```

#### `inject.component(...storeName[])(createOptions)`

同上，为组件注入需被监听的 store。

```ts
inject.component('storeA', 'storeB')(({ storeA, storeB }) => ({
  attached() {
    todos.count
  },

  ...
}))
```

#### `observer.page(stores)(options)`

使页面监听一个或多个 store。

与 inject 的不同之处在于，observer 无需调用 provider 进行全局注入，但需要在页面文件中手动引入 store 对象并传入。

```ts
observer.page({ todos })({
  onLoad() {
    todos.count
  },

  ...
})
```

#### `observer.component(stores)(options)`

同上，使组件监听一个或多个 store。

```ts
observer.component({ todos })({
  attached() {
    todos.count
  },

  ...
})
```

## 🏀 使用

#### 首先定义一个 store

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

class TodoList {
  @observable todos: Todo[] = []

  @action
  add(title: string) {
    this.todos.push(new Todo(title))
  }

  @action
  toggle(id: number) {
    const todo = this.todos.find((item) => item.id === id)

    if (todo) {
      todo.completed = !todo.completed
    }
  }
}

export default new TodoList()
```

#### 然后传递全局 stores 并在页面中注入指定的 store

```ts
import { provider } from 'we-mobx'
import stores from './store/index'

provider(stores)({
  ...
})
```

```ts
import { inject } from 'we-mobx'

inject.page('todos')(({ todos }) => ({
  count: 0,

  addTodo() {
    todos.add('My Todo ' + ++this.count)
  },

  toggleCompleted(e: any) {
    const { id } = e.currentTarget.dataset
    todos.toggle(id)
  },
}))
```

#### 如果使用 observer，则需要传入需监听 store 对象

```ts
import { observer } from 'we-mobx'
import { todos } from '../../store/index'

observer.page({ todos })({
  count: 0,

  addTodo() {
    store.add('My Todo ' + ++this.count)
  },

  toggleCompleted(e: any) {
    const { id } = e.currentTarget.dataset
    store.toggle(id)
  },
})
```

#### store 中的状态会被映射至 data 中，直接在 wxml 中引用

```html
<view wx:for="{{ todos.todos }}" wx:key="id" data-id="{{ item.id }}" bindtap="toggleCompleted">
  <view>
    <view>
      <text>{{ item.title }}</text>
    </view>
    <checkbox checked="{{ item.completed }}"></checkbox>
  </view>
</view>

<button bindtap="addTodo">添加</button>
```

## 🌟FAQ

### 应该使用 provider & inject 的方式，还是使用 observer ？

更推荐 provider & inject 这样组合调用的方式，而 observer 相对来说调用更直观。

### 在 provider 或 observer 传入的 stores 结构应该是怎样的？

在 provider 中需要传入全部 stores 的引用，并且需遵循 `stores: { storeA, storeB }` 这样的格式。

在 observer 中传递的结构与 provider 中类似，但只需传递需被监听的 store。另外在 observer
中传递多层的嵌套也是可行的，但不建议这样做。

## 📄 License

[MIT](https://github.com/clancysong/we-mobx/blob/master/LICENSE)
