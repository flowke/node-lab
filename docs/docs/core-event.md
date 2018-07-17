---
  title: 事件
---

# 事件

## 1. 接口 EventEmitter

`events` 导出一个 `EventEmitter` 类. 这个类可以创建一个事件触发器对象. 通过这个对象, 你可以自己监听和发布一些事件.

发射器对象实现了一些方法:

- on(eventName, listener) 监听事件
- addListener(eventName, listener) 监听事件, `on` 的别名
- once(eventName, listener) 只监听一次
- emit(eventName[, ...args]) 触发事件
- off(eventName, listener) 移除事件监听器, `removeListener` 的别名
- removeListener(eventName, listener) 移除事件器
- removeAllListeners([eventName]) 移除某个事件的所有监听器

一般来说:

- 添加和移除事件监听器都会返回一个 EventEmitter 实例以便链式调用.
- 触发一个事件会返回 bool, 以便知道这个事件是否绑定了事件监听器

#### 概念

`eventName`: 事件名称, 合法的 js 属性名都可以, 通常为 驼峰字符串.
`listener`: 事件回调函数, 也叫监听器, 事件触发的时候回执行.

**触发的事件都是同步触发**


```js
const EventEmitter = require('events');

// 创建一个事件发射器
let emitter = new EventEmitter();

// 监听一个 'hit' 事件, 这个 hit 是你自定义的事件
emitter.on('hit', (who)=>console.log(`${who} hit me`));

// 发布一个 hit 事件, 并向事件回调函数传递一个参数
// flowke hit me
emitter.emit('hit', 'flowke')

// 监听 lon 事件, 只监听一次
emitter.once('lon', (who)=>console.log(`lon trigger`));
emitter.emit('lon'); // -> lon trigger
emitter.emit('lon'); // 什么都不会发生

// 移除某个事件的某个监听器
emitter.off('hit', logHit);
emitter.emit('hit', 'Moli'); // logHit 将不再调用

```

## 2.事件监听器中的this

```js
// 事件监听器中的 this 会指向 EventEmitter 实例.
const myEmitter = new EventEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this);
  // 打印:
  //   a b EventEmitter {
  //     domain: null,
  //     _events: { event: [Function] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined }
});
myEmitter.emit('event', 'a', 'b');

// 箭头函数中, this 不指向 事件触发器的实例.
const myEmitter = new EventEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');

```

## 3. 同步与异步

事件触发的时候, 事件监听器会按照注册顺序同步调用. 可以在监听器中使用 setImmediate() 或 process.nextTick() 异步执行.

```js
const myEmitter = new EventEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('这个是异步发生的');
  });
});
myEmitter.emit('event', 'a', 'b');
```

## 4. 特殊的事件

某些事件并不需要显示的添加, 事件对象本身预先会监听一些事件.

### 4.1 error 事件

当 EventEmitter 实例中发生错误时, 会触发一个特殊的 `error` 事件. 如果没有监听 `error` 事件, 会把错误向上抛出, 造成进程退出.

```js
const myEmitter = new EventEmitter();

// 如果我们没有监听某个事件, 触发它一般不会有任何事情发生,
// 但是触发 error 事件或造成进程退出.
myEmitter.emit('error', new Error('badly!!'))
```

**建议始终监听 error 事件**

```js
const myEmitter = new EventEmitter();

// 会监听 error 事件, 打印 err 参数
myEmitter.on('error', (err)=>{
  console.log(err);
});

myEmitter.emit('error', new Error('badly!!'))

```

### 4.2 newListener 事件

在 EventEmitter 实例在注册一个监听器(把监听器放到数组)之前, 会触发一次 newListener 事件.

- eventName `<any>` 要监听的事件的名称
- listener `<Function>` 事件的句柄函数

```js
const myEmitter = new EventEmitter();
// 只处理一次，所以不会无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在开头插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});

// 这会触发一次 'newListener' 事件
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```
### 4.3 'removeListener' 事件

- eventName <any> 事件名
- listener <Function> 事件句柄函数

`removeListener` 事件在 listener 被移除后触发


## 5. 最大监听数量

每个事件默认可以注册最多 10 个监听器. 超出数量会向 stderr 输出跟踪警告, 提示可能出现内存泄漏:

```bash
MaxListenersExceededWarning
```

> 注: 这个限定不是强制性的, 只是一个警告

可以使用 `process.on('warning')` 监听这个警告:

```js
process.on('warning', (warning)=>{
  // EventEmitter 实例
  console.log(warning.emitter);
  // 事件类型
  console.log(warning.type);
  // 事件监听器的数量
  console.log(warning.count);
})
```

> 注: warning.count 并非所有实际给某个事件添加的监听器数量, 一般是最大数量+1

你可以修改最大可监听数, 以消除警告, 两种方式:

**给所有实例修改最大监听数:**

```js
// 在下面这句代码之后的所有 EventEmitter event 实例
// 的最大监听数会增加到 13
EventEmitter.defaultMaxListeners = 13;
```

> 包括其他模块的 EventEmitter 实例也会受影响

**给某个实例修改最大监听数:**

```js
// 只针对某个实例设置最大监听数
emitter.setMaxListeners(13)
```

## 6. 实例的其他方法

- emitter.eventNames(): 已注册监听器的事件名称数组, 值可能是字符串或 Symbol
- emitter.getMaxListeners(): 获取最大可今天数
- emitter.listenerCount(eventName): 某个事件的监听器数量
- emitter.listeners(eventName): 返回个数组, 数组里面是某个事件的监听器
- emitter.prependListener(eventName, listener): 往监听器数组最前面添加一个事件监听器
- emitter.prependOnceListener(eventName, listener)
- emitter.rawListeners(eventName): 返回事件监听器, 包括 wrapper function

## 7. wrapper function

某些监听器在注册的时候, EventEmitter 会把这些监听器包一层, 例如: once

```js
EventEmitter.prototype.once = function(eventName, listener) {
  this.on(eventName, function wrapper() {
    this.removeListener(eventName, wrapper);
    listener.apply(this, arguments);
  });
}
```

这种时候: `emitter.listeners(eventName)` 在 7.0 之后, 返回的监听器是 listener 实例, 而 rawListeners 返回的监听器是 `wrapper` 函数实例.
