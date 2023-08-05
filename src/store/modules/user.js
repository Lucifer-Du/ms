import { get, post } from '@/utils/http';
import { Notice } from 'view-ui-plus';
import VueCookies from 'vue-cookies';
import router from '@/router';

const user = {
    namespaced: true,
    state: {

    },
    getters: {

    },
    mutations: {
        SET_STATE(state, object) {
            const { key, value } = object;
            state[key] = value
        }
    },
    actions: {
        // setState({ commit }, object) {
        //     commit('SET_STATE', object);
        // },
        handleLogin({ dispatch }, { account = '', password = '' }) {
            post('/api/user/login', {
                account, password
            }).then(res => {
                const { code = 1, data = {}, msg = '' } = res;
                if (code == 1) {
                    VueCookies.set('user_info', data);
                    router.push({ name: 'home' });
                } else {
                    Notice.error({
                        title: '错误信息',
                        desc: msg
                    });
                }
            });
        },
        handleLogout({ dispatch }) {
            VueCookies.remove('user_info');
            router.push({ name: 'login' });
        },
        
    },
};

export default user;
