<template>
    <v-dialog
      v-model="dialog"
      width="500"
      scrollable
    >

      <v-list-tile slot="activator" color="primary" class="v-list__tile--link">
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
            <ExternalLink href="https://github.com/dmstern/npmfrog/releases" text="Changelog"></ExternalLink>
          </p>
          <p>
            This tool requests meta data of npm packages that were published to jFrog's npm registry on {{data.config.artifactory.host}} for integration into another front-end project or for deployment as a back-end dependency.
            It and aims to display them in a way that should help front-end developers to discover the best in-house javascript solutions to solve a specific problem.
          </p>
          <p>
            It's code is developed as open source and published on <ExternalLink :href="data.meta.repository.url" text="GitHub"></ExternalLink>.
            If you discover any bugs or would like to have a feature being added, feel free to file an <ExternalLink :href="data.meta.bugs.url" text="issue"></ExternalLink> or contribute to this project.
          </p>
          <h2 class="subheading">Technologies</h2>
          <v-list>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="require('@/assets/img/vue.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <ExternalLink href="https://vuejs.org" text="Vue.js"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="require('@/assets/img/ts.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
              <ExternalLink href="https://www.typescriptlang.org/" text="TypeScript"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="require('@/assets/img/vuetify.svg')">
              </v-list-tile-avatar>
              <v-list-tile-content>
              <ExternalLink href="http://vuetifyjs.com" text="Vuetify"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="require('@/assets/img/node-icon.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
              <ExternalLink href="https://nodejs.org/" text="node.js"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="require('@/assets/img/express.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
              <ExternalLink href="http://expressjs.com/" text="Express"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar>
                <v-icon>{{$vuetify.icons.transfer}}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
              <ExternalLink href="https://github.com/axios/axios" text="Axios"></ExternalLink>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
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
import ExternalLink from './ExternalLink.vue';

@Component({
  name: 'About',
  components: {
    ExternalLink,
  },
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
          apiKey: '',
        },
        companyScope: '',
      },
    };
    this.loadMetaInfo();
    this.loadConfig();
  }

  private loadMetaInfo(): void {
    DataStore.Instance.getMetaInfo().then((response) => {
      this.data.meta = response;
    });
  }

  private loadConfig(): void {
    DataStore.Instance.getConfig().then((response) => {
      if (response) {
        this.data.config = response;
      }
    });
  }
}

</script>

<style lang="scss" scoped>

.v-dialog__container {
  display: block !important;
}

blockquote {
  padding-top: 0;
  margin: 0;
}

ul {
  list-style: none;

  li {
    margin-left: -1em;
  }
}

</style>

