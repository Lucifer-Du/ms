import { get, post } from '@/utils/http';

const user = {
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
        setState({ commit }, object) {
            commit('SET_STATE', object);
        },
    },
};

export default user;
