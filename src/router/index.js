import { createRouter, createWebHashHistory } from "vue-router";
import Main from '@/components/main/index.vue';

export const routes = [
    {
        path: '/',
        name: '_home',
        redirect: '/user_manage',
        component: Main,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: '/user_manage',
        name: 'user_manage',
        redirect: '/user_manage/user_list',
        component: Main,
        meta: {
            title: '用户管理'
        },
        children: [
            {
                path: 'user_list',
                name: 'user_list',
                meta: {
                    title: '用户列表'
                },
                component: () => import('@/view/user-manage/user-list/list.vue')
            },
            {
                path: 'user_group',
                name: 'user_group',
                meta: {
                    title: '用户分组'
                },
                component: () => import('@/view/user-manage/user-group/list.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/index.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    // if (to.meta.requiresAuth && !VueCookies.get('user')) {
    //     next({
    //         name: 'login'
    //     });
    // } else {
        next();
    // }
});

router.afterEach((to, from) => {
    const { title } = to.meta;
    if (title) {
        window.document.title = title
    }
});

export default router;
