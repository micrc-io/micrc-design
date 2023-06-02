package technology

import groovy.json.JsonSlurper

def executor(def params) {
    def json = new JsonSlurper().parseText(params)
    // 执行自定义方法
    return listFilter(json.list, json.permissions)
}

// 脚本入口
executor(params)

// list筛选
def listFilter(def list, def permissions) {
    def result = [];
    def topMenu = list.findAll { !it.parentCode }
    def filterMenu = list.findAll { menu -> menu.parentCode &&
            menu.authority.every{ authority -> {
                permissions.any { it == authority }
            }}
    }
    result = topMenu.findAll { top ->
        filterMenu.any { menu ->
            menu.parentCode.startsWith(top.key)
        }
    }.each { node ->
        result << [
                "key": node.key,
                "label": node.label,
                "sort": node.sort
        ]
    }
    return result
}
