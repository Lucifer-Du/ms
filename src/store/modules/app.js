import { get, post } from '@/utils/http';
import { Notice } from 'view-ui-plus';
import VueCookies from 'vue-cookies';

const app = {
    namespaced: true,
    state: {
        access_list: []
    },
    getters: {
        access_list: (state) => state.access_list,
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
        handleQueryData({ dispatch }, { method, params = {} }){
            return new Promise(resolve => {
                console.log(method, params)
                get(method, params).then(res => {
                    const { code, data, msg } = res;
                    if (code == 1) {
                        resolve(data);
                    } else {
                        Notice.error({
                            title: '错误信息',
                            desc: msg
                        });
                    }
                });
            });
        }
    },
};

export default app;
