import axios from 'axios';
import router from '../router';

const unAuthorized = () => {
  delete localStorage.accessToken;
  setAuthInHeader(null);
  router.push('/');
}

const request = {
  get(path) {
    return axios.get(path)
      .catch((err) => {
        if(err.request.status === 401) {
          unAuthorized();
        }
        throw Error(err);
      })
  },
  post(path, data) {
    return axios.post(path, data)
      .catch((err) => {
        if(err.request.status === 401) {
          unAuthorized();
        }
        throw Error(err);
      })
  },
  delete(path) {
    return axios.delete(path)
      .catch((err) => {
        if(err.request.status === 401) {
          unAuthorized();
        }
        throw Error(err);
      })
  },
  put(path, data) {
    return axios.put(path, data)
      .catch((err) => {
        if(err.request.status === 401) {
          unAuthorized();
        }
        throw Error(err);
      })
  }
}

export const setAuthInHeader = token => {
  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null;
}

export const auth = {
  login(userId, password) {
    return request.post('/api/login', { userId, password });
  }
}

export const user = {
  fetch(userId) {
    return request.get(`/api/user/${userId}`);
  }
}

export const vacation = {
  fetch(userId) {
    return request.get(`/api/vacation/${userId}`);
  },

  update(item) {
    return request.put('/api/vacation/', { item });
  },

  create(userId, startDate, endDate, days) {
    return request.post('/api/vacation', { userId, startDate, endDate, days });
  }
}