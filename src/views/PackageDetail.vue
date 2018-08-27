<template>
<div>
  <v-container v-if="!data.packageDetail">
    <LoadingSpinner msg="Loading package details..."/>
  </v-container>
  <v-container v-else fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 class="packageDetail__heading">
        <h1>{{ data.packageDetail.name }}</h1>
        <div class="subheading">
          <span>{{data.currentPackage.version}}</span>
          <span>Published <timeago :datetime="data.packageDetail.time.modified"></timeago></span>
        </div>
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
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card v-if="data.packageDetail.mainCode || data.currentPackage.scripts">
              <v-card-text>
                <div v-if="data.currentPackage.scripts">
                  <h2>Scripts</h2>
                  <div v-for="(script, key) in data.currentPackage.scripts" :key="key">
                    <h3>{{key}}</h3>
                    <pre v-highlightjs="script"><code></code></pre>
                  </div>
                </div>
                <div v-if="data.packageDetail.mainCode">
                  <h2>{{data.currentPackage.main}}</h2>
                  <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
                </div>
              </v-card-text>
            </v-card>
            <v-card v-else>Nothing to show...</v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text>
                <h2>Dependencies</h2>
                <v-chip small outline color="primary" v-for="(version, key) in data.currentPackage.dependencies" :key="key">{{key}}</v-chip>
                <h2>DevDependencies</h2>
                <v-chip small outline color="primary" v-for="(version, key) in data.currentPackage.devDependencies" :key="key">{{key}}</v-chip>
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
          <PackageDetailItem title="install" :bigContent="false" v-if="data.config.artifactory" icon="download">
            <pre v-highlightjs="`npm config set ${data.packageDetail.scope ? data.packageDetail.scope + ':' : ''}registry http://${data.config.artifactory.host}/artifactory/api/npm/${data.config.artifactory.repoKey}/`"><code class="bash language-bash hljs"></code></pre>
            <div class="packageDetail__installCode">
              <pre v-highlightjs="`npm i ${data.packageDetail.name}`"><code class="bash language-bash hljs"></code></pre>
              <v-btn flat icon
                color="green darken-2"
                v-clipboard:copy="`npm i ${data.packageDetail.name}`"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">
                <v-icon>mdi-clipboard-arrow-left</v-icon>
              </v-btn>
            </div>
          </PackageDetailItem>
          <PackageDetailItem title="Version" icon="code-fork">
            {{data.currentPackage.version}}
          </PackageDetailItem>
          <PackageDetailItem title="License" v-if="data.currentPackage.license" icon="legal">
            <span>{{data.currentPackage.license}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="Repository" v-if="data.currentPackage.repository" icon="code">
            <a :href="`${data.currentPackage.repositoryUrl }`" target="_blank">
              <v-icon v-if="data.currentPackage.repositoryNameIsBeautified">fa-{{data.currentPackage.repositoryName}}</v-icon>
              {{data.currentPackage.repositoryName}}
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Created" icon="bolt">
            <timeago :datetime="data.packageDetail.time.created"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Last publish" icon="clock-o">
            <timeago :datetime="data.packageDetail.time.modified"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Author" v-if="data.currentPackage.author" icon="user">
            <a v-if="data.currentPackage.author.email" :href="`mailto:${data.currentPackage.author.email}`">{{data.currentPackage.author.name}}</a>
            <span v-else>{{data.currentPackage.displayName}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="Keywords" :bigContent="false" v-if="data.currentPackage.keywords" icon="tags">
            <v-chip v-for="keyword in data.currentPackage.keywords" :key="keyword">{{keyword}}</v-chip>
          </PackageDetailItem>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Package from '@/model/Package';
import PackagesService from '@/services/PackageService';
import Router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { PackageMetaDataDTO, IVersions } from '@/model/package-meta-data';
import BackendApi from '@/services/BackendApi';
import router from '@/router';
import Config from '@/model/Config';
import PackageDetailItem from '@/components/PackageDetailItem.vue';

@Component({
  components: {
    LoadingSpinner,
    PackageDetailItem,
  },
})
export default class PackageDetail extends Vue {

  @Prop() private dataProp!: {
    packageDetail: Package | null,
    currentPackage: Package | null,
    currentTags: IVersions,
    versionsHistory: IVersions,
    config: Config,
  };
  private data: {
    packageDetail: Package | null,
    currentPackage: Package | null,
    currentTags: IVersions,
    versionsHistory: IVersions,
    config: {},
  } = this.dataProp;
  private activeTab: number;

  constructor() {
    super();
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
      currentPackage: null,
      currentTags: {},
      versionsHistory: {},
      config: {},
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
      currentPackage: null,
      currentTags: {},
      versionsHistory: {},
      config: {},
    };
  }

  private init() {
    Promise.all([
      this.getPackageDetails(),
      this.loadConfig(),
    ]);
  }

  private loadConfig() {
    return BackendApi.Instance.getConfig().then((config) => {
      this.data.config = config.data;
    });
  }

  private getPackageDetails() {
    return PackagesService.Instance.getPackageDetail({
      scope: Router.currentRoute.params.scope,
      packageName: Router.currentRoute.params.packageName,
    }).then((response) => {
      this.data.packageDetail = response;
      const currentVersionObject: string | PackageMetaDataDTO =
        this.data.packageDetail.versions[this.data.packageDetail['dist-tags'].latest];
      if (typeof currentVersionObject !== 'string') {
        this.data.currentPackage = new Package(currentVersionObject);
        this.data.currentTags = response['dist-tags'];
        this.data.versionsHistory = response.versions;
      }
    });
  }

  private onCopySuccess() {
    console.log('yay');
  }
  private onCopyError() {
    console.log('argh');
  }
}

</script>

<style lang="scss">
@import '../assets/variables';

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

.packageDetail__heading {
  .subheading {
    font-family: $monospace;

    > span:not(:last-child) {
      &::after {
        content: '•';
        display: inline-block;
        margin: 0 .7em;
      }
    }
  }
}

.packageDetail__installCode {
  display: flex;

  pre {
    flex-grow: 1;
    align-self: flex-end;
  }
}
</style>

