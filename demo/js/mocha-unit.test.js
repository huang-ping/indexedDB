
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

before("测试前先删除之前测试的数据库", function () {
    indexedDB.deleteDatabase(testDbConfig.dbName)
    console.log("测试前先删除之前测试的数据库")
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

let test_db = null
let testData = getTestData()
let testDataId = null
describe('DBFactory 测试用例', function () {
    // this.slow(1)
    it('new DBFactory success', function () {
        // console.log(444)
        test_db = new DBFactory(testDbConfig)
    });
    it('open DBFactory success', function () {
        return test_db.open().then(res => {
            console.log(555, res)
        })
    });
    it('保存数据 addData', function () {
        return test_db.addData("tab1", testData).then(id => {
            testData.id = id
            testDataId = id
            chai.assert.typeOf(id, 'number');
        })
    });
    it('根据主键获取数据 getDataByKey', function () {
        return test_db.getDataByKey("tab1", testDataId).then(data => {
            console.log('根据主键获取数据 getDataByKey', data)
            chai.assert.equal(data.id, testDataId);
        })
    });
    it('更新数据数据 putData', function () {
        let updateData = Object.assign({}, testData)
        updateData.name = "mocha updata user"
        chai.assert.typeOf(updateData.id, 'number');
        return test_db.putData("tab1", updateData).then(id => {
            return test_db.getDataByKey("tab1", updateData.id)
        }).then(data => {
            chai.assert.equal(data.name, "mocha updata user");
        })
    });
    it('根据主键删除数据 deleteDataByKey', function () {
        let id = testData.id
        return test_db.deleteDataByKey("tab1", id).then(() => {
            return test_db.getDataByKey("tab1", id)
        }).then(data => {
            chai.assert.typeOf(data, 'undefined');

        })
    });
});


describe("性能对比测试  addData  putData", function () {
    let times = 100
    let testAddData = getTestData()
    let testPutData = Object.assign({}, testAddData)
    it('保存数据 addData', function () {
        let all = []
        for (let i = 0; i < times; i++) {
            all.push(test_db.addData("tab1", testAddData))
        }
        console.log(5656)
        return Promise.all(all)
    });
    it('保存数据 putData', function () {
        let all = []
        for (let i = 0; i < times; i++) {
            all.push(test_db.putData("tab1", testAddData))
        }
        return Promise.all(all)
    });
})

function getTestData() {
    let obj = {
        name: "mochaTest user",
        tel: "18245889822",
        age: 20,
        email: "652463887@qq.com",
        addr: "liuzhi liunpanshui guizhou china"
    }
    for (let i = 0; i < 30; i++) {
        obj["key" + i] = "value" + i
    }
    return obj
}