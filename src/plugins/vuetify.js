import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const icons = {
  menu: 'fas fa-bars',
  copy: 'far fa-copy',
  copy2Clipboard: 'mdi-clipboard-arrow-left',
  gitlab: 'fab fa-gitlab',
  github: 'fab fa-github',
  search: 'fas fa-search',
  send: 'fas fa-share-square',
  arrowTopLeft: 'mdi-arrow-top-left',
  goTo: 'fas fa-arrow-circle-right',
  tag: 'fas fa-tag',
  tags: 'fas fa-tags',
  package: 'mdi-package-variant-closed',
  author: 'fas fa-user-circle',
  install: 'fas fa-download',
  version: 'fas fa-code-branch',
  legal: 'fas fa-balance-scale',
  code: 'fas fa-code',
  created: 'fas fa-bolt',
  updated: 'far fa-clock',
  about: 'fas fa-info-circle',
  clear: 'fas fa-times',
};

icons.keywords = icons.tags;
icons.keyword = icons.tag;
icons.repository = icons.code;
icons.modified = icons.updated;

Vue.use(Vuetify, {
  iconfont: 'fa', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
    primary: "#D63B09",
    secondary: "#FF7043",
    accent: colors.lightGreen.darken2,
  },
  icons
});
