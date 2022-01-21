import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        /* has token*/
        if (to.path === '/') {
            next({ path: '/homeIndex' })
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetInfo').then(res => {
                        const roles = res.roles
                        store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
                            //当页面刷新时
                            const paths = to.path.split('/');
                            if (paths.length > 3) {
                                //从路由中获取所有业务系统菜单
                                let businessSys = null;
                                for (let i = 0; i < store.state.permission.addRoutes.length; i++) {
                                    if ('BusinessSys' === store.state.permission.addRoutes[i].name) {
                                        businessSys = store.state.permission.addRoutes[i];
                                    }
                                }
                                //获取某一个业务系统菜单
                                if (businessSys) {
                                    let subSys = businessSys.children;
                                    for (let i = 0; i < subSys.length; i++) {
                                        if (subSys[i].path === paths[2] && subSys[i].children) {
                                            //存储该业务系统菜单
                                            store.dispatch('BusinessSys', subSys[i].children);
                                        }
                                    }
                                }
                            }
                            // 测试 默认静态页面
                            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            router.addRoutes(accessRoutes) // 动态添加可访问路由表
                            next({...to, replace: true }) // hack方法 确保addRoutes已完成
                        })
                    })
                    .catch(err => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error(err)
                            next({ path: '/login' })
                        })
                    })
            } else {
                next();
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                // if (hasPermission(store.getters.roles, to.meta.roles)) {
                //   next()
                // } else {
                //   next({ path: '/401', replace: true, query: { noGoBack: true }})
                // }
                // 可删 ↑
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next('/login');
            //next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            //next('/homeIndex');//跳转到集成页面
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})