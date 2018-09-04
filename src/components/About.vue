<template>
    <v-dialog
      v-model="dialog"
      width="500"
      scrollable
    >

      <v-list-tile slot="activator">
        <v-list-tile-action>
          <v-icon>{{$vuetify.icons.about}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>About</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-card>
        <v-card-title
          class="headline lighten-2"
          primary-title
        >
          About npmFrog
        </v-card-title>

        <v-card-text v-if="data.meta">
          <blockquote class="blockquote">{{data.meta.description}}</blockquote>
          <p>
            Version: {{data.meta.version}}
          </p>
          <p>
            This tool requests meta data of npm packages that were published to jFrog's npm registry on {{data.config.artifactory.host}} for integration into another front-end project or for deployment as a back-end dependency.
            It and aims to display them in a way that should help front-end developers to discover the best in-house javascript solutions to solve a specific problem.
          </p>
          <p>
            It's code is developed as open source and published on <a :href="data.meta.repository.url" target="_blank">GitHub</a>.
            If you discover any bugs or would like to have a feature being added, feel free to file an <a :href="data.meta.bugs.url" target="_blank">issue</a> or contribute to this project.
          </p>
          <h2 class="subheading">Technologies</h2>
          <ul>
            <li><a href="https://vuejs.org" target="_blank">Vue.js</a></li>
            <li><a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a></li>
            <li><a href="http://vuetifyjs.com" target="_blank">Vuetify</a></li>
            <li><a href="https://nodejs.org/" target="_blank">node.js</a></li>
            <li><a href="http://expressjs.com/" target="_blank">Express</a></li>
            <li><a href="https://github.com/axios/axios" target="_blank">Axios</a></li>
          </ul>
          <br>
          <v-divider />
          <p>
            Created with 🦄 and ☕ in 2018 by <a href="https://github.com/dmstern" target="_blank">Daniel Morgenstern</a> for ]init[ Pixelschubser Unit<br/>
            Logo icons designed by Freepik and Dimitry Miroliubov from <a href="//www.flaticon.com" target="_blank">Flaticon</a>
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DataStore from '@/services/DataStore';
import Config from '../../types/Config';
import { IPackageJSON } from '../../types/package-json';

@Component({
  name: 'About',
})
export default class About extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private dataProp!: {
    meta: IPackageJSON | undefined,
    config: Config,
  };
  private dialog: boolean = this.dialogOpen;
  private data: {
    meta: IPackageJSON | undefined,
    config: Config,
  } = this.dataProp;

  constructor() {
    super();
    this.dialog = false;
    this.data = {
      meta: undefined,
      config: {
        artifactory: {
          host: '',
          repoKey: '',
          https: false,
        },
      },
    };
    this.loadMetaInfo();
    this.loadConfig();
  }

  private loadMetaInfo() {
    DataStore.Instance.getMetaInfo().then((response) => {
      this.data.meta = response;
    });
  }

  private loadConfig() {
    DataStore.Instance.getConfig().then((response) => {
      if (response) {
        this.data.config = response;
      }
    });
  }
}

</script>

<style lang="scss" scoped>
blockquote {
  padding-top: 0;
  margin: 0;
}
</style>

