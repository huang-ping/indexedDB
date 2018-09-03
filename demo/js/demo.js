
const dbConfig = {
    dbName: "contacts_DB",
    dbVersion: 1,
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
        // console.log("open db success")
    }).catch(error => {
        console.log(error)
    })
}

function saveContact(tableName, contact) {
    db.putData(tableName, contact).then(id => {
        console.log("联系人id：", id)
    }).catch(error => {
        console.error(error)
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

function handleClick(action) {
    let formData = this.getFormValues()
    switch (action) {
        case "save_contact":
            saveContact(formData.tableName, formData)
            break;
        case "search_contact":
            searchContact(formData.tableName, formData)
            break;
        case "search_contact_range":
            searchContactRange(formData.tableName, formData)
            break;
        case "delete_contact":
            deleteContact(formData.tableName, formData)
            break;
        case "clear_contact":
            clearAllContact(formData.tableName, formData)
            break;
        default:
            break;
    }
}
openDB()
var tabList = []
FormConfigs.forEach(config => {
    config.handleClick = handleClick
    let div = document.createElement("div")
    tabList.push({
        name: config.name,
        content: div
    })
    let form = new DomUtils.Form(div, config)
})
new DomUtils.Tabs(tabList, document.getElementById("root"))
// 往contacts2表里面初始化500条数据，用户查询删除等测试
function saveExampleData() {
    function formatNum(num) {
        if (num < 10) {
            return "00" + num
        }
        if (num < 100) {
            return "0" + num
        }
        return num
    }
    for (let i = 1; i < 501; i++) {

        let num = formatNum(i)
        saveContact("contacts2", {
            name: randomName(i),
            tel: randomTel(num),
            addr: "xxx小区" + num + "楼" + i + "号",
            age: (i % 40 + 10) + ""
        })
    }

    function randomName(num) {
        const xin = [
            "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
            "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
            "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
            "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
            "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
            "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
            "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
            "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
            "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
            "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹",
            "司马", "诸葛"
        ]
        const ming = [
            "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
            "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
            "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
            "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
            "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
            "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
            "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
            "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
            "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
            "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
        ]
        let len1 = xin.length
        let len2 = ming.length
        return (xin[num % len1] + ming[num % len2])
    }
    function randomTel(num) {
        let telPrefix = ["130", "131", "132", "133", "135", "137", "138", "170", "180", "187", "189"]
        let len = telPrefix.length
        let tel = telPrefix[Math.floor(Math.random() * len)]
        for (let i = 0; i < 5; i++) {
            tel += Math.floor(Math.random() * 10)
        }
        tel = tel + num
        return tel
    }
}