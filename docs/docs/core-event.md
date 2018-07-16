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

```js
const EventEmitter = require('events');

// 创建一个事件发射器
let emitter = new EventEmitter();

// 监听一个 'hit' 事件, 这个 hit 是你自定义的事件
emitter.on('hit', (who)=>console.log(`${who} hit me`));



```
