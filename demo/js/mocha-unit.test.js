
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

after(function () {
    // 在这个作用域的所有测试用例运行完之后运行
    let linkList = document.querySelectorAll(".suite a")
    linkList.forEach(link => {
        link.removeAttribute("href")
    })
})

// beforeEach(function (...a) {
//     // 在这个作用域的每一个测试用例运行之前运行
//     console.log("4ds645fds564 beforeEach", ...a, 9)
// })

// afterEach(function () {
//     // 在这个作用域的每一个测试用例运行之后运行
// })

let test_db = null
let testData = getTestData()
let testDataId = null
describe('mocha DBFactory 单元测试 用例', function () {
    // this.slow(1)
    describe("基本功能测试", function () {
        it('new DBFactory success', function () {
            test_db = new DBFactory(testDbConfig)
            chai.assert.typeOf(test_db, 'object');
            chai.assert.typeOf(test_db.db, 'null');
        });
        it('open DBFactory success', function () {
            return test_db.open().then(() => {
                chai.assert.equal(test_db.db.name, testDbConfig.dbName);
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
                // console.log('根据主键获取数据 getDataByKey', data)
                chai.assert.equal(data.id, testDataId);
            })
        });
        it('获取表储存数据总数 getTableCount', function () {
            return test_db.getTableCount("tab1").then(count => {
                chai.assert.typeOf(count, 'number');
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
        it('清除表所有数据 clearTable', function () {
            let data = getTestData()
            let ID = null
            return test_db.addData("tab1", data).then((id) => {
                ID = id
                return test_db.clearTable("tab1")
            }).then(data => {
                return test_db.getDataByKey("tab1", ID)
            }).then(data => {
                chai.assert.typeOf(data, 'undefined');
            })
        });
        it('关闭数据库 close', function () {
            test_db.close()
        });
        it('删除数据库 deleteDatabase', function () {
            return test_db.deleteDatabase(testDbConfig.dbName)
        });
        describe("", function () {
            before(function () {
                if (!test_db) {
                    console.log("==============")
                    test_db = new DBFactory(testDbConfig)
                }
                if (test_db.isOpen) {
                    test_db.close()
                }
                test_db.deleteDatabase(testDbConfig.dbName)
                return test_db.open()
            })
            let times = 100
            let dataList = []
            for (let i = 0; i < times; i++) {
                let data = getTestData()
                data.age = i % 20
                dataList.push(data)
            }
            it('保存数据 putDatas', function () {
                return test_db.putDatas("tab1", dataList).then(res => {
                    chai.assert.equal(res.data.length, times);
                })
            });
            it('根据索引统计数据 getCountByIndex', function () {
                return test_db.getCountByIndex("tab1", "age", 10).then(count => {
                    console.log("getCountByIndex", count)
                    chai.assert.typeOf(count, 'number');
                    chai.assert.equal(count, Math.floor(times / 20));
                })
            });
        })
    })
    describe("批量获取数据 getTableData", function () {
        let times = 100
        before(function () {
            if (!test_db) {
                console.log("==============")
                test_db = new DBFactory(testDbConfig)
            }
            if (test_db.isOpen) {
                test_db.close()
            }
            test_db.deleteDatabase(testDbConfig.dbName)
            return test_db.open().then(() => {
                let all = []
                let data = getTestData()
                for (let i = 0; i < times; i++) {
                    let temp = Object.assign({}, data)
                    temp.name = temp.name + "-" + i
                    temp.age = i % 20
                    all.push(test_db.addData("tab1", temp))
                }
                return Promise.all(all)
            })
        })
        it('获取所有数据', function () {
            let id = testData.id
            return test_db.getTableData("tab1").then((dataList) => {
                // console.log("dataList", dataList)
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, times);
            })
        });
        it('获取id 20 到 30 之间的数据，包括20, 不包括30', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                end: 30
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 20);
                chai.assert.equal(dataList[0].id, 20);
                chai.assert.notEqual(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 20 到 30 之间的数据，包括20, 不包括30, 倒序', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                end: 30,
                reverse: true
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 20);
                chai.assert.equal(dataList[0].id, 29);
                chai.assert.notEqual(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 20 到 30 之间的数据，包括20, 包括30', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                end: 30,
                upperOpen: false
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 20 + 1);
                chai.assert.equal(dataList[0].id, 20);
                chai.assert.equal(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 20 到 30 之间的数据，不包括20，包括30', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                end: 30,
                lowerOpen: true,
                upperOpen: false
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 20);
                chai.assert.notEqual(dataList[0].id, 20);
                chai.assert.equal(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 20 到 30 之间的数据，不包括20，不包括30', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                end: 30,
                lowerOpen: true
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 20 - 1);
                chai.assert.notEqual(dataList[0].id, 20);
                chai.assert.notEqual(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 大于等于20的数据', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, times - 20 + 1);
                chai.assert.equal(dataList[0].id, 20);
                chai.assert.equal(dataList[dataList.length - 1].id, times);
            })
        });
        it('获取id 大于20的数据，不包括20', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                start: 20,
                lowerOpen: true
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, times - 20);
                chai.assert.notEqual(dataList[0].id, 20);
                chai.assert.equal(dataList[dataList.length - 1].id, times);
            })
        });
        it('获取id 小于30的数据，不包括30', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                end: 30
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30 - 1);
                chai.assert.equal(dataList[0].id, 1);
                chai.assert.notEqual(dataList[dataList.length - 1].id, 30);
            })
        });
        it('获取id 小于等于30的数据', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                end: 30,
                upperOpen: false
            }).then((dataList) => {
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 30);
                chai.assert.equal(dataList[0].id, 1);
                chai.assert.equal(dataList[dataList.length - 1].id, 30);
            })
        });

        it('获取age 等于10的数据', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                index: "age",
                indexValue: 10
            }).then((dataList) => {
                // console.log("age 等于 10 的数据：", dataList)
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 5);
                chai.assert.equal(dataList[0].age, 10);
                chai.assert.equal(dataList[dataList.length - 1].age, 10);
            })
        });
        it('获取age 大于10, 小于13的数据, 不包括13', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                index: "age",
                start: 10,
                end: 13
            }).then((dataList) => {
                // console.log("获取age 大于10, 小于13的数据, 不包括13：", dataList)
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 15);
                chai.assert.equal(dataList[0].age, 10);
                chai.assert.equal(dataList[dataList.length - 1].age, 12);
            })
        });
        it('获取age 大于10, 小于13的数据, 不包括13，倒序获取', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                index: "age",
                start: 10,
                end: 13,
                reverse: true
            }).then((dataList) => {
                console.log("获取age 大于10, 小于13的数据, 不包括13，倒序获取: ", dataList)
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 15);
                chai.assert.equal(dataList[0].age, 12);
                chai.assert.equal(dataList[dataList.length - 1].age, 10);
            })
        });
        it('获取id 等于10的数据, 但是建议使用getDataByKey', function () {
            let id = testData.id
            return test_db.getTableData("tab1", {
                // index: "id",
                indexValue: 10
            }).then((dataList) => {
                // console.log("id 等于 10 的数据：", dataList)
                chai.assert.typeOf(dataList.length, 'number');
                chai.assert.equal(dataList.length, 1);
                chai.assert.equal(dataList[0].id, 10);
            })
        });
        after(function () {
            test_db.close()
        })
    })

    describe("性能对比测试 putDatas addData  putData", function () {
        before(function () {
            if (!test_db) {
                console.log("==============")
                test_db = new DBFactory(testDbConfig)
            }
            if (test_db.isOpen) {
                test_db.close()
            }
            test_db.deleteDatabase(testDbConfig.dbName)
            return test_db.open()
        })
        let times = 100
        let dataList = []
        for (let i = 0; i < times; i++) {
            dataList.push(getTestData())
        }
        it('保存数据 putDatas', function () {
            return test_db.putDatas("tab1", dataList).then(res => {
                console.log("putDatas", res)
            })
        });
        it('保存数据 putDatas new', function () {
            return test_db.putDatas("tab1", dataList, true).then(res => {
                console.log("putDatas", res)
            })
        });
        it('保存数据 addData', function () {
            let all = []
            for (let i = 0; i < times; i++) {
                all.push(test_db.addData("tab1", dataList[i]))
            }
            return Promise.all(all)
        });

        it('保存数据 putData', function () {
            let all = []
            for (let i = 0; i < times; i++) {
                all.push(test_db.putData("tab1", dataList[i]))
            }
            return Promise.all(all)
        });
        after(function () {
            test_db.close()
        })
    })



});

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