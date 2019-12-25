import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pt from 'vuetify/es5/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#9C27B0',
        secondary: '#34495e',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4caf50',
        warning: '#FFC107',
      },
    },
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
});
