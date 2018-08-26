
var FormConfigs = [
    {
        name: "示例: 保存联系人",
        // tableName: "contacts",
        items: [
            { label: "姓名", name: "name", defaultValue: "张三" },
            { label: "电话", name: "tel", defaultValue: "" },
            { label: "地址", name: "addr", defaultValue: "" },
            { label: "邮箱", name: "email", defaultValue: "" },
            { label: "年龄", name: "age", defaultValue: "" },
            { label: "联系人表", name: "tableName", defaultValue: "contacts1", type: "select", options: ["contacts1", "contacts2"], mark: "contacts2 表的电话(tel)唯一，不可重复" }
        ],
        btns: [
            { btnText: "保存", action: "save_contact" }
        ]
    },
    {
        name: "示例: 查询、删除、清空",
        // tableName: "contacts",
        items: [
            { label: "联系人表", name: "tableName", defaultValue: "contacts2", type: "select", options: ["contacts1", "contacts2"], mark: "contacts2 表的电话(tel)唯一，不可重复" },
            { label: "索引", name: "searchkey", defaultValue: "id", type: "select", options: ["id", "name", "age", "tel", "addr"] },
            { label: "索引值", name: "keyvalue", defaultValue: "1" },
        ],
        btns: [
            { btnText: "查询", action: "search_contact" },
            { btnText: "删除", action: "delete_contact" },
            { btnText: "清空", action: "clear_contact" }
        ]
    },
    {
        name: "示例: 安装范围查询联系人",
        // tableName: "contacts",
        items: [
            { label: "联系人表", name: "tableName", defaultValue: "contacts2", type: "select", options: ["contacts1", "contacts2"], mark: "contacts2 表的电话(tel)唯一，不可重复" },
            { label: "索引", name: "searchkey", defaultValue: "id", type: "select", options: ["id", "name", "age", "tel", "addr"] },
            { label: "start", name: "start", defaultValue: "1" },
            { label: "end", name: "end", defaultValue: "10" },
        ],
        btns: [
            { btnText: "查询", action: "search_contact_range" }
        ]
    }
]