/**
 * indexedDB api
 */
class DBFactory {
    constructor({ dbName, dbVersion, tables }) {
        this.db = null
        this.DB_NAME = dbName
        this.DB_VERSION = dbVersion
        this.isOpen = false
        this.tables = Object.prototype.toString.call(tables) === "[object Array]" ? tables : []
    }
    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)
            request.onsuccess = (e) => {
                this.isOpen = true
                this.db = e.target.result
                resolve()
                this.log('成功打开数据库')
            }
            request.onerror = (e) => {
                let error = e.target.error
                reject({
                    name: error.name,
                    code: error.code,
                    errMsg: error.message
                })
            }
            request.onupgradeneeded = this._onUpgradeneeded.bind(this)
        })
    }
    close() {
        this.isOpen = false
        this.db.close()
    }
    deleteDatabase(dbName) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.deleteDatabase(dbName)
            request.onsuccess = function (e) {
                resolve()
                // console.log("deleteDatabase success", e)
            }
            request.onerror = request.onabort = function (e) {
                let error = e.target.error
                reject({
                    name: error.name,
                    code: error.code,
                    errMsg: error.message
                })
                // console.log("deleteDatabase onabort", e)
            }
        })
    }
    /**
     * 添加数据 主键重复会报错
     * @param {*} tableName 
     * @param {*} data 
     */
    addData(tableName, data) {
        return this._requestDBResult(tableName, "readwrite", function (store) {
            return store.put(data)
        })
    }
    /**
     * 更新 主键重复会更新
     * @param {*} tableName 
     * @param {*} data 
     */
    putData(tableName, data) {
        return this._requestDBResult(tableName, "readwrite", function (store) {
            return store.put(data)
        })
    }
    /**
     * 根据主键查找数据
     * @param {table name} tableName 
     * @param {要查找的值} keyPathValue 
     */
    getDataByKey(tableName, keyPathValue) {
        return this._requestDBResult(tableName, "readonly", function (store) {
            return store.get(keyPathValue)
        })
    }
    /**
     * 根据主键删除数据
     * @param {*} tableName 
     * @param {*} keyPathValue 
     */
    deleteDataByKey(tableName, keyPathValue) {
        return this._requestDBResult(tableName, "readwrite", function (store) {
            return store.delete(keyPathValue)
        })
    }
    /**
     * 
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
    getTableData(tableName, option) {
        return this._requestDBCursor(tableName, function (store) {
            let keyRange = option ? this._getIDBKeyRange(option) : null
            // console.log(keyRange, "keyRange")
            option = option || {}
            if (option.index && store.keyPath !== option.index) {
                let indexStore = store.index(option.index)
                return indexStore.openCursor(keyRange, option.reverse ? (IDBCursor.PREV || "prev") : undefined)
            }
            // if (keyRange === null && store.getAll) {
            //     return store.getAll()
            // }
            return store.openCursor(keyRange, option.reverse ? (IDBCursor.PREV || "prev") : undefined)
        })
    }
    /**
     * 获取总条数
     * @param {*} tableName 
     */
    getTableCount(tableName) {
        return this._requestDBResult(tableName, "readonly", function (store) {
            return store.count()
        })
    }
    /**
     * 根据 索引获取数据
     * @param {*} tableName 
     * @param {* 索引名} index 
     * @param {* 索引值} indexValue 
     * 获取到的是最早储存的一条数据
     */
    getDataByIndexOnly(tableName, index, indexValue) {
        return this._requestDBResult(tableName, "readonly", function (store) {
            const indexStore = store.index(index)
            return indexStore.get(indexValue)
        })
    }
    deleteDataByIndex() {
        return Promise.reject({
            code: 0,
            name: "DeleteDataByIndexError",
            errMsg: "按照索引删除未实现"
        })
    }
    /**
     * 清除table所有数据
     * @param {*} tableName 
     */
    clearTable(tableName) {
        return this._requestDBResult(tableName, "readwrite", function (store) {
            return store.clear()
        })
    }
    _requestDBResult(tableName, writeMode, next) {
        return new Promise((resolve, reject) => {
            if (!this.isOpen) {
                reject({
                    code: 0,
                    name: "OpenError",
                    errMsg: "db is not open"
                })
                return
            }
            const store = this._getObjectStore(tableName, writeMode)
            const req = next(store)
            req.onsuccess = (e) => {
                resolve(e.target.result)
                this.log("[addData] store objectStore onsuccess, tableName: " + tableName)
            }
            req.onerror = (e) => {
                let error = e.target.error
                reject({
                    name: error.name,
                    code: error.code,
                    errMsg: error.message
                })
                this.log("[addData] store objectStore onerror, tableName: " + tableName, e.target.error)
            }
        })
    }
    _getIDBKeyRange(option) {
        if (!option) {
            return null
        }
        option.lowerOpen = "lowerOpen" in option ? option.lowerOpen : false
        option.upperOpen = "upperOpen" in option ? option.upperOpen : true
        if (option.start && option.end) {
            // 当前索引的值介于 start 和 end 之间
            return IDBKeyRange.bound(option.start, option.end, option.lowerOpen, option.upperOpen);
        }
        else if (option.start) {
            // 当前索引的值 大于 start
            return IDBKeyRange.lowerBound(option.start, option.lowerOpen);
        }
        else if (option.end) {
            // 当前索引的值 小于 start
            return IDBKeyRange.upperBound(option.end, option.upperOpen);
        }
        else if (option.indexValue) {
            // 当前索引的值 等于 start
            return IDBKeyRange.only(option.indexValue);
        }
        else {
            return null
        }
    }
    _requestDBCursor(tableName, next, mode) {
        return new Promise((resolve, reject) => {
            if (!this.isOpen) {
                reject({
                    code: 0,
                    name: "OpenError",
                    errMsg: "db is not open"
                })
                return
            }
            let data = []
            const store = this._getObjectStore(tableName, mode || 'readonly')
            const curRequest = next.call(this, store)
            curRequest.onsuccess = (e) => {
                let cursor = e.target.result
                // console.log(cursor)
                if (cursor) {
                    cursor.continue()
                    data.push(cursor.value)
                    this.log("[getTabData] request onsuccess, tableName: " + tableName + " curKey: " + cursor.key)
                }
                else {
                    resolve(data)
                }

            }
            curRequest.onerror = (e) => {
                let error = e.target.error
                reject({
                    name: error.name,
                    code: error.code,
                    errMsg: error.message
                })
                this.log("[getTabData] request onerror, tableName: " + tableName, e.target.error)
            }
        })
    }
    _getObjectStore(tableName, mode) {
        if (!this.db.objectStoreNames.contains(tableName)) {
            this.log("[_getObjectStore] table 不存在：tableName: ", tableName)
            throw new Error(`${tableName} does not exist`)
            return null
        }
        //  mode: readonly, readewrite, versionchange
        const transaction = this.db.transaction(tableName, mode)
        transaction.oncomplete = (e) => {
            this.log("[_getObjectStore] transaction complete, tableName: " + tableName, e)
        }
        transaction.onabort = (e) => {
            this.log("[_getObjectStore] transaction abort, tableName: " + tableName, e)
        }
        transaction.onerror = (e) => {
            this.log("[_getObjectStore] transaction error, tableName: " + tableName, e.target.error)
        }
        return transaction.objectStore(tableName)
    }
    _onUpgradeneeded(e) {
        const db = e.target.result
        const transaction = e.target.transaction
        this.db = db
        const createTable = onCreateTable.bind(this, db, transaction)
        this.tables.forEach(createTable)
        this.log('升级数据库')

        function onCreateTable(db, transaction, table) {
            if (db.objectStoreNames.contains(table.tableName)) {
                // debugger
                // db.deleteObjectStore(table.tableName)
                this.log('[onCreateTable]' + table.tableName + '已存在')
                const store = transaction.objectStore(table.tableName)
                let indexNames = Array.from(store.indexNames)
                for (let i = 0, len = table.indexs.length; i < len; i++) {
                    let index = table.indexs[i]
                    let post = indexNames.indexOf(index.indexName)
                    if (post === -1) {
                        store.createIndex(index.indexName, index.indexKey || index.indexName, {
                            unique: index.unique || false
                        })
                    }
                    indexNames.splice(post, 1)
                    // console.log(index)
                }
                indexNames.forEach(item => {
                    store.deleteIndex(item)
                })
                // console.log("indexNamesindexNamesindexNames", indexNames)
                return
            }
            // else {
            const keyPath = table.keyPath
            const indexs = table.indexs
            const objectStore = db.createObjectStore(table.tableName, {
                keyPath: keyPath.keyPathName,
                autoIncrement: keyPath.autoIncrement === false ? false : true
            })
            indexs.forEach(index => {
                // 三个参数，第一个是索引名称，第二个是建立索引的属性名，第三个是参数对象 TODO
                objectStore.createIndex(index.indexName, index.indexKey || index.indexName, {
                    unique: index.unique || false
                })
            })
        }
    }
    log(str) {
        // console.log("[ " + this.DB_NAME + " ] " + str)
        // console.log(...l)
    }
}