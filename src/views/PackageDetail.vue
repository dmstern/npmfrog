<template>
  <v-container>
    <h1 v-if="data.packageDetail">{{ data.packageDetail.name }}</h1>
    <v-tabs v-model="activeTab" v-if="data.packageDetail">
      <v-tab ripple>README</v-tab>
      <v-tab ripple v-if="data.packageDetail.mainCode">main code file</v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div v-highlightjs v-if="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="data.packageDetail.mainCode">
        <v-card flat>
          <v-card-text>
            <h1>{{data.packageDetail.versions[data.packageDetail['dist-tags'].latest].main}}</h1>
            <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
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

@Component({
  components: {
    LoadingSpinner,
  },
})
export default class PackageDetail extends Vue {

  @Prop() private dataProp!: { packageDetail: Package };
  private data: { packageDetail: Package | null } = this.dataProp;
  private activeTab: number;

  constructor() {
    super();
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
    };
    this.getPackageDetails();
  }

  private getPackageDetails() {
    PackagesService.Instance.getPackageDetail({
      scope: Router.currentRoute.params.scope,
      packageName: Router.currentRoute.params.packageName,
    }).then((response) => {
      this.data.packageDetail = response;
    });
  }
}

</script>
