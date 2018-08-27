import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';
import 'font-awesome/css/font-awesome.min.css';

Vue.use(Vuetify, {
  iconfont: 'fa4', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
    primary: "#D63B09",
    secondary: "#FF7043",
    accent: colors.lightGreen.darken2,
  },
});
