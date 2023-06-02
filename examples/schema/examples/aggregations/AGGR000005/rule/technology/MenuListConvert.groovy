package technology

import groovy.json.JsonSlurper

def executor(def params) {
    def json = new JsonSlurper().parseText(params)
    // 执行自定义方法
    return buildTree(json.list, json.parentCode, json.permissions)
}

// 脚本入口
executor(params)

// list转树
def buildTree(def list, def parentCode, def permissions) {
    def result = []
    list.findAll { it.parentCode == parentCode &&
            (!it.uri || it.authority.every{ authority -> {
                permissions.any { it == authority }
            }})
    }
            .sort { it.sort }
            .each { node ->
                result << [
                        "key": node.key,
                        "uri": node.uri,
                        "label": node.label,
                        "sort": node.sort,
                        "type": node.type ? node.type.toLowerCase() : null,
                        "children": buildTree(list, node.key, permissions)
                ]
            }
    result = result.findAll { it.uri || it.children }
    return result
}
