import Vue from 'vue';

export default {
  create (cliente, success, error) {
    Vue.axios.post('cliente', { ...cliente }).then((response) => {
      if (success) success(response.data);
    }).catch((err) => {
      if (error) error(err);
    });
  },
  update (cliente, success, error) {
    Vue.axios.put(`cliente/${cliente._id}`, { ...cliente }).then((response) => {
      if (success) success(response.data);
    }).catch((err) => {
      if (error) error(err);
    });
  },
  delete (cliente, success, error) {
    Vue.axios.delete(`cliente/${cliente._id}`).then((response) => {
      if (success) success(response.data);
    }).catch((err) => {
      if (error) error(err);
    });
  },
};
