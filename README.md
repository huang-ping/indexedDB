# indexedDB

#### 项目介绍
indexedDB 封装便于直接使用

#### 软件架构
软件架构说明
[说明文字](#test)

#### 安装教程

> 如果在最新的浏览器使用，直接引用  src/DBFactory.js，否则需要babel编译，推荐webpack

#### 使用说明
* 初始化数据库

> 1. 初始化数据库
```
/**
 * dbName  indexedDB name
 * dbVersion    版本号
 * tables 表
 * -- tableName  表名
 * -- keyPath    主键
 * -- -- keyPathName   主键名
 * -- -- autoIncrement 是否自动递增
 * -- indexs   索引
 * -- -- indexName 索引名
 * -- -- unique    索引值是否唯一
 * -- -- indexName 一般不填，
 */
const dbConfig = {
    dbName: "contacts_DB",       // DB name
    dbVersion: 1,              // 版本,
    tables: [
        {
            tableName: "contacts1",
            keyPath: { keyPathName: 'id', autoIncrement: true },
            indexs: [
                { indexName: 'name', unique: false },
                { indexName: 'tel', unique: false },
                { indexName: 'age', unique: false },
                { indexName: 'addr', unique: false }
            ]
        },
        {
            tableName: "contacts2",
            keyPath: { keyPathName: 'id', autoIncrement: true },
            indexs: [
                { indexName: 'name', unique: false },
                { indexName: 'tel', unique: true },
                { indexName: 'age', unique: false }
            ]
        }
    ]
}

db = new DBFactory(dbConfig)
// 
db.open().then(data => {
    console.log("open db success")
}).catch(error => {
    console.log(error)
})
```
<span id="test">test</span>
2. xxxx
3. xxxx

#### 参与贡献

1. Fork 本项目
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 码云特技

1. 使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2. 码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3. 你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4. [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5. 码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6. 码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)