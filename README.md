# indexedDB

#### 项目介绍
indexedDB 封装便于直接使用，indexedDB未加浏览器前缀兼容老版本浏览器

#### 软件架构
软件架构说明
[说明文字](#test)

#### 安装教程

> 如果在最新的浏览器使用，直接引用  src/DBFactory.js，否则需要babel编译，推荐webpack

### 使用说明
> #### 1、初始化数据库
> ```db = new DBFactory(dbConfig)```  
> ```db.open()```  
>> dbConfig示例：
> * dbName       indexedDB name
> * dbVersion    版本号 int类型 增加table 或者增加删除索引时需要升级版本号
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
>   dbVersion: 1,   // 版本, int类型 增加table 或者增加删除索引时需要升级版本号
>   tables: [
>      {
>           tableName: "contacts2",
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
>```
  
> #### 2、添加/更新数据
> ```
> db.addData(tableName, data)
> db.putData(tableName, data)
> ```
>> 示例
>```
> let data = {
>     name: "张三",
>     tel: "17682330989",
>     age: "29",
>     addr: "浙江-杭州-xxx小区",
> }
> // 数据重复时会报错
> db.addData("contacts2",data).then(id => {
>     data.id = id
>     console.log("联系人id：", id)
> })
> data.age = 30
> // 数据重复时会更新
> db.putData("contacts2",data).then(id => {})
> ```
  
> #### 3、根据主键查找数据  
> ```getDataByKey(tableName, keyPathValue)```
>> 示例
> ```
> // 获取id为1的联系人
> db.getDataByKey("contacts2", 1).then(data=>{
>   console.log(data)    
> })
> ```
  
> #### 4、根据主键删除数据  
> ```deleteDataByKey(tableName, keyPathValue)``` 
>> 示例 
> ```
> db.deleteDataByKey("contacts2", 1).then(data=>{
>   console.log(data)   
> })
> ```
  
> #### 5、获取数据
> ```
> /**
>   * @param {*} tableName 
>   * @param {*} option 
>   * option = {
>   *  start:      
>   *  lowerOpen:  // 查询范围 是否 不包含 start 默认 false
>   *  end: 
>   *  upperOpen:  // 查询范围 是否 不包含 end   默认 true
>   *  index:      // 索引名 若为空，则为主键
>   *  indexValue: // 索引值 start end存在时不生效 
>   * }
>   */ 
> ```
> ``` db.getTableData(tableName, option)```
>> 示例
> 
> // 获取 表contacts2 的所有数据  
> ```
> db.getTableData("contacts2").then(data=>{
>   console.log(data)
> })
>```   
>
> // 获取 id 大于20的所有数据
> ```
> db.getTableData("contacts2", {
>   start: 20
> }).then(datas=>{
>   console.log(datas)
> })
> ```
> 
> // 获取 索引age 大于等于20的所有数据  
> ```
> db.getTableData("contacts2", {
>   start: "20",
>   index: "age"
> }).then(datas=>{
>   console.log(datas)    
> })
> ```
> // 获取 索引age 大于20小于30(不包括30)的所有数据  
> ```
> db.getTableData("contacts2", {
>   start: "20",
>   end: "30",
>   index: "age"
> }).then(datas=>{
>   console.log(datas)
> })
> ```
> // 获取年龄小于 20 的所以数据
> ```
> db.getTableData("contacts2", {
>   end: "20",
>   index: "age"
> }).then(data=>{
>   console.log(datas)    
> }) 
> ```
> // 获取 索引age 等于 20 的所有数据   
> ```
> db.getTableData("contacts2", {
>   index: "age",
>   indexValue: "20"
> }).then(datas=>{
>   console.log(datas)    
> })
> ```

> #### 6、获取表数据总数
> ```db.getTableCount(tableName)```
>> 示例
> ```
> db.getTableCount("contacts2").then(count=>{
>   console.log(count)
> })
> ```

> #### 7、根据索引获取数据  
> ```getDataByIndexOnly(tableName, index, indexValue) ```
>> 示例
> ```
> db.getDataByIndexOnly("contacts2", "tel", "17636559897").then(count=>{
>   console.log(data)
>})
> ```

> #### 8、根据id删除 规划中 

> #### 9、根据索引删除 规划中

> #### 10、批量更新或增加 规划中


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