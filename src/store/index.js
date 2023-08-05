import { createStore } from "vuex";
// import app from './modules/app';
import user from './modules/user';

const store = createStore({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		// app,
		user
	}
});

export default store;
