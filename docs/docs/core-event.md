---
  title: 事件
---

# 事件

## 1. 接口 EventEmitter

`events` 导出一个 `EventEmitter` 类. 这个类可以创建一个事件触发器对象. 通过这个对象, 你可以自己监听和发布一些事件.

发射器对象实现了一些方法:

- on(eventName, listener) 监听事件
- addListener(eventName, listener) 监听事件, `on` 的别名
- once(eventName, listener) 只监听一次
- emit(eventName[, ...args]) 触发事件
- off(eventName, listener) 移除事件监听器, `removeListener` 的别名
- removeListener(eventName, listener) 移除事件器
- removeAllListeners([eventName]) 移除某个事件的所有监听器

#### 概念

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

## 特殊的事件

某些事件并不需要显示的添加, 事件对象本身预先会监听一些事件.

### error 事件

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

// 会监听 error 事件, 打印 err 参数
myEmitter.on('error', (err)=>{
  console.log(err);
});

myEmitter.emit('error', new Error('badly!!'))

```
