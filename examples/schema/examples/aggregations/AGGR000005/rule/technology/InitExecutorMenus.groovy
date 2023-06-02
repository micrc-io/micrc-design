package technology

import groovy.json.JsonSlurper

def executor(def params) {
    def json = new JsonSlurper().parseText(params)
    // 执行自定义方法
    return mergeMenus(json.initMenus, json.initializedMenus)
}

// 脚本入口
executor(params)

// 定义合并数据的方法
def mergeMenus(def initMenus, def initializedMenus) {
    def mergedMenus = []
    // 遍历 initMenus
    initMenus.each { initMenu ->
        def menuCode = initMenu.menuCode
        def initializedMenu = initializedMenus.find { it.menuCode == menuCode }
        if (initializedMenu) {
            // 如果 initializedMenu 中存在相同的 menuCode，则使用initializedMenu
            initializedMenu.delFlag = 0
            mergedMenus << initializedMenu
        } else {
            // 如果 initializedMenus 中不存在相同的 menuCode，则将 initMenus 的数据直接添加到合并结果中
            initMenu.delFlag = 0
            mergedMenus << initMenu
        }
    }

    // 遍历 initializedMenus，将不在合并结果中的数据添加到合并结果中，并标记为删除
    initializedMenus.each { initializedMenu ->
        def menuCode = initializedMenu.menuCode
        def mergedMenu = mergedMenus.find { it.menuCode == menuCode }
        if (!mergedMenu) {
            initializedMenu.delFlag = 1
            mergedMenus << initializedMenu
        }
    }

    return mergedMenus
}
