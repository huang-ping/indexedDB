# indexedDB

#### 项目介绍
indexedDB 封装便于直接使用

#### 软件架构
软件架构说明
[说明文字](#test)

#### 安装教程

> 如果在最新的浏览器使用，直接引用  src/DBFactory.js，否则需要babel编译，推荐webpack

### 使用说明
> #### 1、初始化数据库
> ```db = new DBFactory(dbConfig)```  
> ```db.open()```  
> dbConfig示例：
> * dbName  indexedDB name
> * dbVersion    版本号
> * tables 表
> * -- tableName  表名
> * -- keyPath    主键
> * -- -- keyPathName   主键名
> * -- -- autoIncrement 是否自动递增
> * -- indexs   索引
> * -- -- indexName 索引名
> * -- -- unique    索引值是否唯一
> * -- -- indexName 一般不填，用于存储的data属性名和索引名不一致情况
> ```
> const dbConfig = {
>   dbName: "contacts_DB",       // DB name
>   dbVersion: 1,              // 版本,
>   tables: [
>      {
>           tableName: "contacts1",
>           keyPath: { keyPathName: 'id', autoIncrement: true },
>           indexs: [
>               { indexName: 'name', unique: false },
>               { indexName: 'tel', unique: false },
>               { indexName: 'age', unique: false },
>               { indexName: 'addr', unique: false }
>           ]
>       },
>       {
>           tableName: "contacts2",
>           keyPath: { keyPathName: 'id', autoIncrement: true },
>           indexs: [
>               { indexName: 'name', unique: false },
>               { indexName: 'tel', unique: true },
>               { indexName: 'age', unique: false }
>           ]
>       }
>   ]
> }
> db = new DBFactory(dbConfig)
> // 
> db.open().then(data => {
>   console.log("open db success")
> }).catch(error => {
>   console.log(error)
> })
```
> #### 2、保存数据 db.addData  db.addData
```
// 新增
let data = {
    name: "张三",
    tel: "17682330989",
    age: "29",
    addr: "浙江-杭州-xxx小区",
}
// 更新
db.addData("contacts1",data).then(id => {
    data.id = id
    console.log("联系人id：", id)
})
db.putData("contacts1",data).then(id => {})
```
> #### 3、根据主键查找数据 db.getDataByKey
```
db.getDataByKey("contacts1", 1).then(data=>{})
```
> #### 4、根据主键删除数据 db.deleteDataByKey
```
db.deleteDataByKey("contacts1", 1).then(data=>{})
```
> #### 5、获取数据 db.getTableData(tableName, option)
```
  /**
    * @param {*} tableName 
    * @param {*} option 
    * option = {
    *  start:      
    *  lowerOpen:  // 查询范围 是否 不包含 start 默认 false
    *  end: 
    *  upperOpen:  // 查询范围 是否 不包含 end   默认 true
    *  index:      // 索引名 若为空，则为主键
    *  indexValue: // 索引值 start end存在时不生效 
    * }
    */
```
> 示例
```
// 获取 表contacts1 的所有数据
db.getTableData("contacts1").then(data=>{})
// 获取 id 大于20的所有数据
db.getTableData("contacts1", {
    start: 20
//    lowerOpen: false, 是否不包含
}).then(data=>{})
// 获取 索引age 大于20的所有数据
db.getTableData("contacts1", {
    start: "20",
    index: "age"
}).then(data=>{})
// 获取 索引age 大于20小于30(不包括30)的所有数据
db.getTableData("contacts1", {
    start: "20",
    end: "30",
    index: "age"
}).then(data=>{})
// 获取 索引age 等于 20 的所有数据
db.getTableData("contacts1", {
    index: ""age,
    indexValue: "20"
}).then(data=>{})
db.getTableData("contacts1", {
    end: "20",
    index: "age"
}).then(data=>{})
```
> #### 6、获取表格数据条数 db.getTableCount
```
db.getTableCount("contacts1").then(count=>{})
```
> #### 6、根据索引获取数据  
> ```getDataByIndexOnly(tableName, index, indexValue) ```
> * 根据 索引获取数据
> * @param {*} tableName 
> * @param {* 索引名} index 
> * @param {* 索引值} indexValue 
> * @desc 获取到的是最早储存的一条数据
```
db.getDataByIndexOnly("contacts1", "tel", "17636559897").then(count=>{})
```


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