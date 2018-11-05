import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const icons = {
  menu: 'fas fa-bars',
  copy: 'far fa-copy',
  copy2Clipboard: 'mdi-clipboard-arrow-left',
  gitlab: 'fab fa-gitlab',
  github: 'fab fa-github',
  search: 'fas fa-search',
  send: 'fas fa-share-square',
  arrowTopLeft: 'mdi-arrow-top-left',
  arrowTopRight: 'mdi-arrow-top-right',
  goTo: 'fas fa-arrow-circle-right',
  tag: 'fas fa-tag',
  tags: 'fas fa-tags',
  package: 'mdi-package-variant-closed',
  author: 'fas fa-user-circle',
  download: 'fas fa-download',
  install: 'mdi-package-down',
  version: 'fas fa-code-branch',
  legal: 'fas fa-balance-scale',
  code: 'fas fa-code',
  created: 'fas fa-bolt',
  updated: 'far fa-clock',
  info: 'fas fa-info-circle',
  howto: 'far fa-question-circle',
  clear: 'fas fa-times',
  bug: 'fas fa-bug',
  contact: 'far fa-comments',
  mail: 'far fa-envelope',
  website: 'fas fa-globe',
  externalLink: 'fas fa-external-link-alt',
  terminal: 'fas fa-terminal',
  email: 'far fa-envelope',
  home: 'fas fa-home',
  upload: 'fas fa-upload',
  transfer: 'fas fa-exchange-alt',
  newspaper: 'far fa-newspaper',
  new: 'mdi-new-box',
  bullhorn: 'fas fa-bullhorn',
  folder: 'far fa-folder',
  folderOpen: 'far fa-folder-open',
  file: 'far fa-file',
  fileTxt: 'far fa-file-alt',
  fileImage: 'far fa-file-image',
  fileVideo: 'far fa-file-video',
  readme: 'fab fa-readme',
  npm: 'fab fa-npm',
  nodeJS: 'fab fa-node-js',
  js: 'fab fa-js-square',
  html: 'far fa-file-code',
  css: 'fab fa-css3-alt',
  archive: 'far fa-file-archive',
  json: 'mdi-json',
  git: 'fab fa-git-square',
  babel: 'mdi-babel',
  ts: 'mdi-language-typescript',
  sass: 'fab fa-sass',
  md: 'mdi-markdown',
  font: 'fas fa-font',
  license: 'fas fa-file-contract',
  configFile: 'fas fa-clipboard-check',
  gulp: 'fab fa-gulp',
  grunt: 'fab fa-grunt',
  webpack: 'mdi-webpack',
  fingerUp: 'far fa-hand-point-up',
};

icons.keywords = icons.tags;
icons.keyword = icons.tag;
icons.repository = icons.code;
icons.modified = icons.updated;
icons.homepage = icons.website;
icons.crafter = icons.author;
icons.changelog = icons.newspaper;
icons.packageJson = icons.nodeJS;
icons.markup = icons.html;
icons.tgz = icons.archive;
icons.gz = icons.archive;
icons.tar = icons.archive;
icons.zip = icons.archive;
icons.scss = icons.sass;
icons.about = icons.info;
icons.jpg = icons.fileImage;
icons.png = icons.fileImage;
icons.svg = icons.fileImage;
icons.peng = icons.fileImage;
icons.jpeg = icons.fileImage;
icons.bmp = icons.fileImage;
icons.gif = icons.fileImage;
icons.ico = icons.fileImage;
icons.ttf = icons.font;
icons.pfb = icons.font;
icons.pfa = icons.font;
icons.afm = icons.font;
icons.dfont = icons.font;
icons.ttc = icons.font;
icons.pfm = icons.font;
icons.eot = icons.font;
icons.woff = icons.font;
icons.woff2 = icons.font;
icons.otf = icons.font;
icons.map = icons.copy;
icons.mp4 = icons.fileVideo;
icons.mpeg = icons.fileVideo;
icons.mpg = icons.fileVideo;
icons.mp2 = icons.fileVideo;
icons.mpe = icons.fileVideo;
icons.mpv = icons.fileVideo;
icons.m2v = icons.fileVideo;
icons.webm = icons.fileVideo;
icons.flv = icons.fileVideo;
icons.avi = icons.fileVideo;
icons.wmv = icons.fileVideo;
icons.m4p = icons.fileVideo;
icons.m4v = icons.fileVideo;
icons.yml = icons.configFile;
icons.yaml = icons.yml;
icons.hbs = icons.html;
icons.nunj = icons.html;
icons.ftl = icons.html;

Vue.use(Vuetify, {
  iconfont: 'fa', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
    primary: '#D63B09',
    secondary: '#FF7043',
    accent: colors.lightGreen.darken2,
  },
  icons,
});
