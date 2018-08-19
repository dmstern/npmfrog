<template>
  <div v-if="data.pachageDetail">
    <h2>{{data.packageDetail.name}}</h2>
    <div>{{data.packageDetail}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Package from '@/model/Package';
import PackagesService from '@/services/PackageService';
import Router from '@/router';

@Component
export default class PackageDetail extends Vue {

  @Prop() private dataProp!: { packageDetail: Package };
  private data: { packageDetail: Package | null | string} = this.dataProp;

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
