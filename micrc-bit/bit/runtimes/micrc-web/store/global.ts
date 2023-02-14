
export const useGlobalStore = () => null; // 由各模块导入，与模块自己的userStore一起，传给action/bind

export const initGlobalStore = (meta: any) => null; // 通过传入的客户端口元数据，构造集成、路由表，并使用useGlobalStore放在global中
