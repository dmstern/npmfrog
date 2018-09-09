<template>
<div>
  <v-container v-if="!data.packageDetail">
    <LoadingSpinner msg="Loading package details..."/>
  </v-container>
  <v-container v-else fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md7 xl8 class="packageDetail__heading">
        <h1>{{ data.packageDetail.name }}</h1>
        <div class="subheading last-published-version-line">
          <span>{{data.currentPackage.version}}</span>
          <span>Published <timeago :datetime="data.packageDetail.time.modified"></timeago></span>
        </div>
      </v-flex>
      <v-flex xs12 md5 xl4>
        <blockquote
          v-if="data.packageDetail.description"
          class="blockquote blockquote--beautify"
        >{{data.packageDetail.description}}</blockquote>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md7 xl8 order-xs2 order-md1>
        <v-tabs v-model="activeTab">
          <v-tab>README</v-tab>
          <v-tab>Main Code</v-tab>
          <v-tab>{{data.currentPackage.dependenciesCount}} Dependencies</v-tab>
          <v-tab>{{Object.keys(data.packageDetail.versions).length}} Versions</v-tab>
          <v-tab-item class="readme">
            <v-card>
              <v-card-text>
                <div v-highlightjs v-if="data.packageDetail.readme" :key="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
                <div v-else>
                  <v-alert :value="true" type="warning">
                    No README.md file found.
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text v-if="data.packageDetail.mainCode || data.currentPackage.scripts">
                <div v-if="data.currentPackage.scripts">
                  <h2>Scripts</h2>

                  <table>
                    <thead>
                      <tr>
                        <th>Command</th>
                        <th>executes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(script, key) in data.currentPackage.scripts" :key="key">
                        <td>
                          <CodeBlock :code="['start', 'test', 'version'].some(task => task === key) ? `npm ${key}` : `npm run ${key}`" language="bash"></CodeBlock>
                        </td>
                        <td><pre v-highlightjs="script"><code class="bash"></code></pre></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="data.packageDetail.mainCode">
                  <h2>{{data.currentPackage.main}}</h2>
                  <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
                </div>
              </v-card-text>
              <v-card-text v-else>
                <v-alert :value="true" type="info">
                  Nothing to show...
                </v-alert>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text v-if="data.currentPackage.dependenciesCount">
                <h2>Dependencies</h2>
                <router-link
                  v-for="(version, key) in data.currentPackage.dependencies"
                  :key="key"
                  :to="`/package/${key}`">
                  <v-chip
                    small
                    outline
                    color="primary"
                  >
                    {{key}}
                  </v-chip>
                </router-link>
                <h2>DevDependencies</h2>
                <router-link
                  v-for="(version, key) in data.currentPackage.devDependencies"
                  :key="key"
                  :to="`/package/${key}`">
                  <v-chip
                    small
                    outline
                    color="primary"
                  >
                    {{key}}
                  </v-chip>
                </router-link>
              </v-card-text>
              <v-card-text v-else>
                <v-alert :value="true" type="info">
                  This package has no dependencies.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text>
                <h2>Current Tags</h2>
                <v-list>
                  <v-list-tile v-for="(version, tag) in data.currentTags" :key="tag">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="version"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-title v-text="tag"></v-list-tile-title>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <h2>Version History</h2>
                <v-list>
                  <v-list-tile v-for="(historicPackage, version) in data.versionsHistory" :key="version">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="version"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-title>
                        <timeago :datetime="data.packageDetail.time[version]"></timeago>
                      </v-list-tile-title>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-flex>
      <v-flex xs12 md5 xl4 order-xs1 order-md2 class="meta-panel">
        <v-layout row wrap>
          <PackageDetailItem title="install" :bigContent="false" v-if="data.config && data.config.artifactory" :icon="$vuetify.icons.install" :full="true">
            <CodeBlock :code="getInstallCode().config" language="bash"></CodeBlock>
            <CodeBlock :code="getInstallCode().install" language="bash"></CodeBlock>
          </PackageDetailItem>
          <PackageDetailItem title="Version" :icon="$vuetify.icons.version">
            <span>{{data.currentPackage.version}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="License" v-if="data.currentPackage.license" :icon="$vuetify.icons.legal">
            <span>{{data.currentPackage.license}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="Website" v-if="data.currentPackage.homepage" :icon="$vuetify.icons.homepage">
            <a :href="`${data.currentPackage.homepage}`" target="_blank" class="link--external">
              <v-icon>{{$vuetify.icons.externalLink}}</v-icon>
              {{data.currentPackage.homepage}}
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Repository" v-if="data.currentPackage.repository" :icon="$vuetify.icons.code">
            <a :href="`${data.currentPackage.repositoryUrl }`" target="_blank">
              <v-icon v-if="data.currentPackage.repositoryName in $vuetify.icons">{{$vuetify.icons[data.currentPackage.repositoryName]}}</v-icon>
              {{data.currentPackage.repositoryName}}
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Feedback" v-if="data.currentPackage.bugs" :icon="$vuetify.icons.contact">
            <a :href="`${data.currentPackage.bugTrackerUrl }`" target="_blank" title="go to / report issues">
              <v-icon>{{$vuetify.icons.bug}}</v-icon>
            </a>
            <a :href="`mailto:${data.currentPackage.bugs.email }`" v-if="data.currentPackage.bugs.email" target="_blank" title="write email">
              <v-icon>{{$vuetify.icons.mail}}</v-icon>
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Created" :icon="$vuetify.icons.created">
            <timeago :datetime="data.packageDetail.time.created"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Last publish" :icon="$vuetify.icons.updated">
            <timeago :datetime="data.packageDetail.time.modified"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Crafted by" v-if="data.currentPackage.author" :icon="$vuetify.icons.author" :bigContent="false">
            <v-menu
              open-on-hover
              auto
              v-for="(crafter, index) in data.currentPackage.crafters"
              :key="index"
              top
              offset-y
            >
              <CrafterAvatar
                :crafter="crafter"
                slot="activator"
              ></CrafterAvatar>
              <v-card>
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                       <CrafterAvatar :crafter="crafter"></CrafterAvatar>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{crafter.name}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{crafter.url}}</v-list-tile-sub-title>
                    </v-list-tile-content>

                  </v-list-tile>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-tile @click="triggerSearchFilter(crafter)">
                    <v-list-tile-action>
                      <v-icon>{{$vuetify.icons.arrowTopLeft}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Search for packages by this crafter</v-list-tile-title>
                  </v-list-tile>

                  <a :href="`mailto:${crafter.email}`" target="_blank">
                    <v-list-tile v-if="crafter.email">
                      <v-list-tile-action>
                        <v-icon>{{$vuetify.icons.email}}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>mailto:{{crafter.email}}</v-list-tile-title>
                    </v-list-tile>
                  </a>
                </v-list>
              </v-card>
            </v-menu>
          </PackageDetailItem>
          <PackageDetailItem title="Keywords" :bigContent="false" v-if="data.currentPackage.tags" :icon="$vuetify.icons.tags">
            <a href="#"
              title="Search for packages with this keyword"
              v-for="(tag, index) in data.currentPackage.tags"
              :key="index"
            >

            <v-chip
              @click="triggerSearchFilter(tag)"
            >
              {{tag.value}}
              <v-icon right>{{$vuetify.icons.arrowTopLeft}}</v-icon>
            </v-chip>
            </a>
          </PackageDetailItem>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Package from '../../types/Package';
import DataStore from '@/services/DataStore';
import Router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { PackageMetaDataDTO, IVersions } from '../../types/package-meta-data';
import router from '@/router';
import Config from '../../types/Config';
import PackageDetailItem from '@/components/PackageDetailItem.vue';
import CodeBlock from '@/components/CodeBlock.vue';
import CrafterAvatar from '@/components/CrafterAvatar.vue';
import { EventBus, Events } from '@/services/event-bus';
import { setTimeout } from 'timers';

@Component({
  components: {
    LoadingSpinner,
    PackageDetailItem,
    CodeBlock,
    CrafterAvatar,
  },
})
export default class PackageDetail extends Vue {

  @Prop() private dataProp!: {
    packageDetail: Package | null,
    currentPackage?: Package,
    currentTags: IVersions,
    versionsHistory: IVersions,
    config: Config | undefined,
  };
  private data: {
    packageDetail: Package | null,
    currentPackage?: Package,
    currentTags: IVersions,
    versionsHistory: IVersions,
    config: Config | undefined,
  } = this.dataProp;
  private activeTab: number;

  constructor() {
    super();
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
      currentPackage: undefined,
      currentTags: {},
      versionsHistory: {},
      config: undefined,
    };
    router.afterEach((route) => {
      if (route.name === 'packageDetail') {
        this.resetModel();
        this.init();
      }
    });
    this.init();
  }

  private resetModel() {
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
      currentPackage: undefined,
      currentTags: {},
      versionsHistory: {},
      config: undefined,
    };
  }

  private init() {
    Promise.all([
      this.getPackageDetails(),
      this.loadConfig(),
    ]);
  }

  private loadConfig() {
    return DataStore.Instance.getConfig().then((config) => {
      this.data.config = config;
    });
  }

  private getPackageDetails() {
    return DataStore.Instance.getPackageDetail({
      scope: Router.currentRoute.params.scope,
      packageName: Router.currentRoute.params.packageName,
    }).then((response) => {
      this.data.packageDetail = response.packageDetail;
      this.data.currentTags = response.packageDetail['dist-tags'];
      this.data.versionsHistory = response.packageDetail.versions;
      this.data.currentPackage = response.currentPackage;
    });
  }

  private getInstallCode() {
    if (this.data.packageDetail && this.data.config && this.data.config.artifactory) {
      return {
        config: `npm config set ${
          this.data.packageDetail.scope
        ? this.data.packageDetail.scope + ':'
        : ''
        }registry http://${
          this.data.config.artifactory.host
        }/artifactory/api/npm/${
          this.data.config.artifactory.repoKey
        }/`,
        install: `npm i ${this.data.packageDetail.name}`,
      };
    }
  }

  private triggerSearchFilter(tag) {
    router.push(`/`);
    this.$nextTick(() => {
      EventBus.$emit(Events.TRIGGER_FILTER_SEARCH, { filters: [tag] });
    });
  }
}

</script>

<style lang="scss">
@import "../assets/variables";

pre code.hljs {
  margin-bottom: 1em;
}

.version-list {
  list-style: none;

  li {
    width: 100%;
    display: flex;
  }
}

.last-published-version-line {
  font-family: $monospace;

  > span:not(:last-child) {
    &::after {
      content: "•";
      display: inline-block;
      margin: 0 0.7em;
    }
  }
}

.blockquote--beautify {
  position: relative;

  &::before,
  &::after {
    font-size: 10em;
    position: absolute;
    font-family: Georgia, "Times New Roman", Times, serif;
    color: $color-gray-extralight;
    opacity: 0.3;
  }

  &::before {
    content: "„";
    left: 0;
    bottom: -60px;
  }

  &::after {
    content: "“";
    top: -51px;
    transform: translateX(-1rem);
  }
}
</style>

