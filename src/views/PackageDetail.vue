<template>
<div>
  <v-container v-if="!data.packageDetail">
    <LoadingSpinner msg="Loading package details..."/>
  </v-container>
  <v-container v-else fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 >{{ data.packageDetail.name }}</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
       <v-flex xs12 md8 order-xs2 order-md1>
    <v-tabs v-model="activeTab">
      <v-tab>README</v-tab>
      <v-tab v-if="data.packageDetail.mainCode">main code file</v-tab>
      <v-tab>{{data.dependenciesCount}} Dependencies</v-tab>
      <v-tab>Versions</v-tab>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <div v-highlightjs v-if="data.packageDetail.readme" :key="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="data.packageDetail.mainCode">
        <v-card>
          <v-card-text>
            <h2>{{data.currentPackage.main}}</h2>
            <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
          </v-card-text>
        </v-card>
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
                <v-list-tile-avatar>
                  <v-list-tile-title v-text="tag"></v-list-tile-title>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
            <h2>Version History</h2>
            <v-list>
              <v-list-tile v-for="(historicPackage, version) in data.versionsHistory" :key="version">
                <v-list-tile-content>
                  <v-list-tile-title v-text="version"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
       </v-flex>
       <v-flex xs12 md4 order-xs1 order-md2>
         <v-card v-if="data.config.artifactory">
          <v-card-title primary-title class="title">install</v-card-title>
          <pre v-highlightjs><code class="bash language-bash hljs">npm config set registry http://{{data.config.artifactory.host}}/artifactory/api/npm/{{data.config.artifactory.repoKey}}/
npm i {{data.packageDetail.name}}</code></pre>
         </v-card>
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

@Component({
  components: {
    LoadingSpinner,
  },
})
export default class PackageDetail extends Vue {

  @Prop() private dataProp!: {
    packageDetail: Package | null,
    currentPackage: Package | null,
    dependeciesCount: number,
    currentTags: IVersions,
    versionsHistory: IVersions,
    config: Config,
  };
  private data: {
    packageDetail: Package | null,
    currentPackage: Package | null,
    dependeciesCount: number,
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
      dependeciesCount: 0,
      currentTags: {},
      versionsHistory: {},
      config: {},
    };
    router.afterEach((route) => {
      if (route.name === 'packageDetail') {
        this.init();
      }
    });
    this.init();
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
        const dependencies = this.data.currentPackage.dependencies;
        const devDependencies = this.data.currentPackage.devDependencies;
        if (dependencies && devDependencies) {
          this.data.dependeciesCount = Object.keys(dependencies).length + Object.keys(devDependencies).length;
        }
        this.data.currentTags = response['dist-tags'];
        this.data.versionsHistory = response.versions;
      }
    });
  }
}

</script>

<style lang="scss">
.version-list {
  list-style: none;

  li {
    width: 100%;
    display: flex;
  }
}
</style>

