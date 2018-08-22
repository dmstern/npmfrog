<template>
  <v-container>
    <h1 v-if="data.packageDetail">{{ data.packageDetail.name }}</h1>
    <v-tabs v-model="activeTab" v-if="data.packageDetail">
      <v-tab>README</v-tab>
      <v-tab v-if="data.packageDetail.mainCode">main code file</v-tab>
      <v-tab>{{data.dependenciesCount}} Dependencies</v-tab>
      <v-tab>Versions</v-tab>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <div v-highlightjs v-if="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="data.packageDetail.mainCode">
        <v-card>
          <v-card-text>
            <h1>{{data.currentPackage.main}}</h1>
            <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <h3>Dependencies</h3>
            <v-chip small outline color="primary" v-for="(version, key) in data.currentPackage.dependencies" :key="key">{{key}}</v-chip>
            <h3>DevDependencies</h3>
            <v-chip small outline color="primary" v-for="(version, key) in data.currentPackage.devDependencies" :key="key">{{key}}</v-chip>
          </v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs>
    <LoadingSpinner msg="Loading package details..." v-else />
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Package from '@/model/Package';
import PackagesService from '@/services/PackageService';
import Router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { PackageMetaDataDTO } from '@/model/package-meta-data';

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
  };
  private data: {
    packageDetail: Package | null,
    currentPackage: Package | null,
    dependeciesCount: number,
  } = this.dataProp;
  private activeTab: number;

  constructor() {
    super();
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
      currentPackage: null,
      dependeciesCount: 0,
    };
    this.getPackageDetails();
  }

  private getPackageDetails() {
    PackagesService.Instance.getPackageDetail({
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
      }
    });
  }
}

</script>
