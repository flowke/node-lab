module.exports = {

  // 名字 he navLink 的 type 一致
  // docs 文件夹下的子文件夹名要和此键名保持一致
  docs: [
    {
      // 一个文档分类
      title: '核心',
      // level 文件名前缀
      level: 'core',
      list: [
        // 0: 文件名
        // 1: 显示的标题
        ['module', '模块加载'],
        ['fs', '文件系统'],
        ['buffer', '缓冲区与二进制数据'],
      ]
    },
    {
      title: '欢迎',
      level: 'welcom',
      list: [
        ['here', '这里是 welcom 下的第一篇文档'],
        ['second', '这里是 welcom 下的第二篇文档'],

      ]
    }
  ],

};
