import { createRouter, createWebHashHistory } from "vue-router";
import VueCookies from 'vue-cookies';
import Main from '@/components/main/index.vue';

export const routes = [
    {
        path: '/',
        name: 'home',
        redirect: '/user_manage/user_info',
        component: Main,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: '/user_manage',
        name: 'user_manage',
        component: Main,
        meta: {
            title: '用户管理',
            access: ['admin', 'teacher', 'student']
        },
        children: [
            {
                path: '/user_manage/user_list',
                name: 'user_list',
                meta: {
                    title: '用户列表',
                    requiresAuth: true,
                    access: ['admin', 'teacher']
                },
                component: () => import('@/view/user-manage/user-list/list.vue')
            },
            // {
            //     path: '/user_manage/user_group',
            //     name: 'user_group',
            //     meta: {
            //         title: '用户分组',
            //         requiresAuth: true,
            //         access: ['admin', 'teacher']
            //     },
            //     component: () => import('@/view/user-manage/user-group/list.vue')
            // }
            {
                path: '/user_manage/user_info',
                name: 'user_info',
                meta: {
                    title: '个人信息',
                    requiresAuth: true,
                    access: ['admin', 'teacher', 'student']
                },
                component: () => import('@/view/user-manage/user-info/index.vue')
            }
        ]
    },
    {
        path: '/course_manage',
        name: 'course_manage',
        component: Main,
        meta: {
            title: '学科管理',
            access: ['admin', 'teacher']
        },
        children: [
            {
                path: '/course_manage/course_list',
                name: 'course_list',
                meta: {
                    title: '学科列表',
                    requiresAuth: true,
                    access: ['admin', 'teacher']
                },
                component: () => import('@/view/course-manage/course_list/list.vue')
            },
            {
                path: '/course-manage/course_record',
                name: 'course_record',
                meta: {
                    title: '学科成绩',
                    requiresAuth: true,
                    access: ['admin', 'teacher']
                },
                component: () => import('@/view/course-manage/course-record/list.vue')
            },
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
    if (to.meta.requiresAuth && (!VueCookies.isKey('user') || !VueCookies.get('user').user_id)) {
        next({
            name: 'login'
        });
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    const { title } = to.meta;
    if (title) {
        window.document.title = title
    }
});

export default router;
