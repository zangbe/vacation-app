import Vue from 'vue'
import Vuex from 'vuex'
import { auth, user, vacation, setAuthInHeader } from '../api'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: [],
    vacation: [],
    accessToken: ''
  },

  mutations: {
    LOGIN(state, result) {
      if (result.data.token) {
        state.user = result.data.result;
        state.accessToken = result.data.token;
        localStorage.accessToken = result.data.token;
        setAuthInHeader(result.data.token);
        router.push('/user');
      } else {
        throw Error('아이디/비밀번호 확인 필요.');
      }
    },

    LOGOUT (state) {
      state.accessToken = null;
      delete localStorage.accessToken;
      setAuthInHeader(null);
    },

    FETCH_USER(state, result) {
      state.user = result.data;
    },

    FETCH_VACATION(state, result) {
      state.vacation = result.data;
    },

    UPDATE_VACATION(state, result) {
      if (!result.data) {
        throw Error('update fail');
      } else {
        return true;
      }
    },

    CREATE_VACATION(state, result) {
      if (result.data.error) {
        throw Error('남은 휴가가 없거나 신청한 휴가 일수가 남은 휴가 일수보다 많습니다.');
      }
    }
  },

  actions: {
    LOGIN({ commit }, { userId, password }) {
      return auth.login(userId, password)
        .then((result) => {
          commit('LOGIN', result);
        });
    },

    FETCH_USER({ commit }, { userId }) {
      return user.fetch(userId)
        .then((result) => {
          commit('FETCH_USER', result);
        });
    },

    FETCH_VACATION({ commit }, { userId }) {
      return vacation.fetch(userId)
        .then((result) => {
          commit('FETCH_VACATION', result);
        });
    },

    UPDATE_VACATION({ commit }, { item }) {
      return vacation.update(item)
        .then((result) => {
          return commit('UPDATE_VACATION', result);
        });
    },

    CREATE_VACATION({ commit }, { userId, startDate, endDate, days }) {
      return vacation.create(userId, startDate, endDate, days)
        .then((result) => {
          commit('CREATE_VACATION', result);
          return result;
        });
    }
  },

  getters: {
    isAuthenticated(state) {
      return !!state.accessToken;
    },
  }
})
