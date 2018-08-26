
const dbConfig = {
    dbName: "contacts_DB",
    dbVersion: "1",
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
var db = {}

function openDB() {
    db = new DBFactory(dbConfig)
    db.open().then(data => {
        console.log("open db success")
    }).catch(error => {
        console.log(error)
    })
}

function saveContact(tableName, contact) {
    // console.log("contact")
    // contact.id = 5
    db.putData(tableName, contact).then(id => {
        console.log("联系人id：", id)
    }).catch(error => {
        console.error(error)
        console.log(error.code)
        console.log(error.message)
        console.log(error.name)
    })
}
function update(tableName, contact) {
    // console.log("contact")
    contact.id = 2
    db.addData(tableName, contact).then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}

function searchContact(tableName, param) {
    let result = null
    if ("id" === param.searchkey) {
        result = db.getDataByKey(tableName, parseInt(param.keyvalue))
    }
    else {
        // result = db.getTableData(tableName, param.searchkey, param.keyvalue)
        result = db.getTableData(tableName, {
            index: param.searchkey,
            indexValue: param.keyvalue
        })
    }
    result.then(contact => {
        console.log("search contact: ", contact)
    })
}
function searchContactRange(tableName, param) {
    if (param.searchkey === "id") {
        // id是number类型需要转换下
        param.start = parseInt(param.start)
        param.end = parseInt(param.end)
    }
    db.getTableData(tableName, {
        index: param.searchkey,
        start: param.start,
        end: param.end,
    }).then(contact => {
        console.log("search contact: ", contact)
    })
}
function deleteContact(tableName, param) {
    let result = null
    if ("id" === param.searchkey) {
        result = db.deleteDataByKey(tableName, parseInt(param.keyvalue))
    }
    else {
        result = db.deleteDataByIndex(tableName, param.searchkey, param.keyvalue)
    }
    result.then(contact => {
        console.log("delete contact success")
    }).catch(error => {
        console.log(error)
    })
}
function clearAllContact(tableName, param) {
    let bool = window.confirm("确定清空所有数据？")
    if (bool) {
        db.clearTable(tableName).then(contact => {
            console.log("delete contact success")
        })
    }

}
function getAllTableData(tableName) {
    db.getTableData(tableName).then(contacts => {
        console.log("delete contact success", contacts)
    })
}