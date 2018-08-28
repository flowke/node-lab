---
  title: 文件系统
---

# 文件系统

`node` 提供了 `fs` 模块来对文件进行操作.

所有的文件系统操作都有异步和同步两种形式。

异步形式的最后一个参数都是回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

## 1. 查看文件信息

### 1.1 fs.stat

使用 fa.stat 可以获得一个文件的相关信息.

```js
fs.stat('./mes.md', (err, stats)=>{
  if(!err){
    console.log(stats);
  }
})
```

其中同步版本为:

```js
fs.statSync(path[, options])
```

不建议在调用 `fs.open()`, `fs.readFile()` or `fs.writeFile()` 时用 fs.stat() 检查文件是否存在, 而是直接进行 打开/读取/写 这类的操作, 在起内部进行错误处理就好了.

如果只想检查文件是否存在而不进行后续操作, 建议使用 [`fs.access()`](http://nodejs.cn/s/NCPsM3)
.

查看更多关于 :point_right::point_right: [fs.stat()]() 的接口信息.

### 1.2 fs.Stats 类

其中 `stats` 是 [fs.Stats 类](http://nodejs.cn/api/fs.html#fs_class_fs_stats)的一个实例:

```js
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1, //文件的硬链接数量。
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1, // 表示文件最后一次被访问的时间戳
  mtimeMs: 1318289051000.1, // 文件内容修改
  ctimeMs: 1318289051000.1, // 文件改变, 比如权限变了
  birthtimeMs: 1318289051000.1, // 创建时间
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

从 [fs.stat()](http://nodejs.cn/api/fs.html#fs_fs_stat_path_options_callback)、[fs.lstat()](http://nodejs.cn/api/fs.html#fs_fs_lstat_path_options_callback) 和 [fs.fstat()](http://nodejs.cn/s/MopJ4a) 及其同步版本返回的对象都是该类型。如果传入这些函数的 options 中的 bigint 为 true，则数值会是 bigint 型而不是 number 型。

```go
// bigint 版本
Stats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

Stats 实例还会有一些方法, 比如检查是不是文件, 还是一个目录等等.

可以查看更多 :point_right::point_right: [Stats](http://nodejs.cn/api/fs.html#fs_class_fs_stats) 的内容.
