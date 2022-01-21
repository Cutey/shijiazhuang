import {constantRoutes} from '@/router'
import {getRouters} from '@/api/menu'
/*后台管理系统布局容器*/
import Layout from '@/layout/index'
/*业务系统布局容器*/
import Business from '@/layout/business/Business'
const permission = {
    state: {
        routes: [],
        addRoutes: [],
        businessSysMenu:[],//业务系统菜单
        businessSysSubMenu:[],//业务系统子菜单
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        SET_BUSINESSMENU:(state, menu) => {
            state.businessSysMenu = menu;
        },
        SET_BUSINESS_SUB_MENU:(state, menu) =>{
            state.businessSysSubMenu = menu;
        }
    },
    actions: {
        // 生成路由
        GenerateRoutes({commit}) {
            let sysTypes = ['system','business'];
            return new Promise(resolve => {
                // 向后端请求路由数据
                getRouters(sysTypes).then(res => {
                    const accessedRoutes = filterAsyncRouter(res.data);
                    accessedRoutes.push({path: '*', redirect: '/404', hidden: true})
                    commit('SET_ROUTES', accessedRoutes)
                    resolve(accessedRoutes)
                });
            });
        },
        //存储业务系统菜单
        BusinessSys({commit},menu){
            commit('SET_BUSINESSMENU', menu);
        },
        //存储业务系统子菜单
        BusinessSysSbuMenu({commit},menu){
            commit('SET_BUSINESS_SUB_MENU', menu);
        }
    }
}

// 遍历后台传来的路由字符串，转换为组件对象

function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        if (route.component) {
            // Layout组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            }else if (route.component === 'Business') {
                route.component = Business
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
}

export const loadView = (view) => { // 路由懒加载
    return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
