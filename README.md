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

- `observer.page(store)(options)` 创建页面
- `observer.component(store)(options)` 创建组件

## 🏀 示例

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

#### 然后可以在页面中直接引入

```ts
import observer from 'we-mobx'
import store from '../../store/index'

observer.page(store)({
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
<view wx:for="{{ todos }}" wx:key="id" data-id="{{ item.id }}" bindtap="toggleCompleted">
  <view>
    <view>
      <text>{{ item.title }}</text>
    </view>
    <checkbox checked="{{ item.completed }}"></checkbox>
  </view>
</view>

<button class="cu-btn lines-cyan lg round" bindtap="addTodo">添加</button>
```

### 🌟 Tips

如果只想将 store 映射至 data 单独的一个属性中，可以这样传入

```ts
observer.page({ store })({
  onLoad() {
    this.data.store.todos
  }

  ...
})
```

对于多个 store 的引用，当然可以这样传入

```ts
observer.page({ a: storeA, b: storeB })({
  onLoad() {
    this.data.a.todos
  }

  ...
})
```

多层的嵌套也是可行的，但不建议这样做

另外，请保证传递的结构中包含 store 对象的直接引用，而非通过枚举操作（拓展操作符、Object.assign 等）复制产生的新的引用，这样可能会导致 store 中不可枚举属性的丢失

```ts
observer.page(store)({}) // good
observer.page({ ...store })({}) // bad
```

## 📄 License

[MIT](https://github.com/clancysong/we-mobx/blob/master/LICENSE)
