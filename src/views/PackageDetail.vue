<template>
  <v-container v-if="data.packageDetail">
    <h1 v-if="!data.packageDetail.readme">{{ data.packageDetail.name }}</h1>
    <div v-highlightjs v-if="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
    <div v-if="data.packageDetail.mainCode">
      <h1>main: {{data.packageDetail.versions[data.packageDetail['dist-tags'].latest].main}}</h1>
      <pre v-highlightjs="data.packageDetail.mainCode"><code></code></pre>
    </div>
  </v-container>
  <LoadingSpinner msg="Loading package details..." v-else />
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

  constructor() {
    super();
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
