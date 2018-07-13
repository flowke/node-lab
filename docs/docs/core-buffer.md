
---
  title: Buffer
---

# 缓冲区 与 二进制数据

## 1.1 创建 Buffer

```js
// 使用 utf-8 编码字符串创建, (默认编码格式)
let buf = new Buffer('buf')

// 使用 base64 编码的字符串创建
let buf64 = new Buffer('dfkl8sd9f', 'base64');

// 如果没有内容初始化, 可以知道长度以备将来容纳数据
// 这里会有 2048个字节的长度
// 其包含的数据是 0
let bf = new Buffer(2048);

```

> 注: 一个字节的大小为8位二进制数, 10进制即: 0-255 之间

可选的编码格式:

- ascii: ASCII 字符集
- utf8: Unicode 字符集
- base64: 基于64个可打印的 ASCII 字符表示 二进制数据. 两种数据类型可以相互转换.

## 1.2 设置和读取

```js
let bf1 = new Buffer('abc');
console.log(bf1[2]); // -> 99

// 没有指定内容 数据会是随机值
let bf2 = new Buffer(1024);
console.log(bf2[4]);

bf2[9] = 100;

// 通过length访问长度
bf2.length;

```

> 注:
> - 如果设置一个 >255的值, 会被 256 取模后赋值: bf[2] = 256; bf[2] === 0;
> - 小时部分会向下取整: 1.5 => 1
> - 超出编辑赋值不会有效.

## 1.3 其它操作

#### 切分缓冲区

```js
let b1 = new Buffer('abcdefghijklmn');
let sb1 = b1.slice(2,5);

console.log(sb1.toString()); // -> cde

b1[4] = 57;
sb1[0] = 55;

//虽然是两个对象, 但并未分配内存
console.log(b1===sb1); // false
console.log(sb1.toString()); // 7d9
console.log(b1.toString()); // ab7d9fghijklmn

```

这并没有分配新内存, 而是对内存的引用. 这意味着修改各自的部分可能会对对方造成影响.

> 注: 关于Buffer, 对象会分配到内存, 有一个固定的内存地址. 而不是 JavaScript VM中, 不会被GC回收.

#### 复制缓冲区

```js
let bf1 = new Buffer('here a hook');

let bf2 = new Buffer(12);

//target targetStart, sourceStart, sourceEnd
bf1.copy(bf2, 0, 1, 8)

```
