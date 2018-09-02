const testDbConfig = {
    dbName: "mocha_unit_test_db",
    dbVersion: 1,
    tables: [
        {
            tableName: "tab1",
            keyPath: { keyPathName: 'id', autoIncrement: true },
            indexs: [
                { indexName: 'name', unique: false },
                { indexName: 'age', unique: false }
            ]
        }
    ]
}


before(function () {
    indexedDB.deleteDatabase(testDbConfig.dbName)
})

// after(function () {
//     // 在这个作用域的所有测试用例运行完之后运行
// })

// beforeEach(function () {
//     // 在这个作用域的每一个测试用例运行之前运行
//     console.log("4ds645fds564 beforeEach")
// })

// afterEach(function () {
//     // 在这个作用域的每一个测试用例运行之后运行
// })


describe('DBFactory 测试用例', function () {
    let db = null
    describe('new DBFactory', function () {
        it('new DBFactory success', function () {
            db = new DBFactory(dbConfig)
        });
    });
    describe('open DBFactory', function () {
        it('open DBFactory success', function () {
            return db.open()
        });
    });
});