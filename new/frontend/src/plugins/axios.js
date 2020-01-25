"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '../router';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: 'http://localhost:15000/v1',
  baseURL: process.env.VUE_APP_ENV === 'dev' ? process.env.VUE_APP_API_URL_DEV : process.env.VUE_APP_API_URL_PROD
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let token = '';
    if (typeof localStorage.token != 'undefined') token = localStorage.token;

    if (token != '') config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status == 401) {
      router.push('/');
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios;
      }
    },
    $axios: {
      get () {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin);

export default Plugin;
