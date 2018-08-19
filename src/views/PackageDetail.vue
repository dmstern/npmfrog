<template>
  <div class="about">
    <h2>{{this.$route.params.scope? `${this.$route.params.scope}/` : ''}}{{this.$route.params.packageName}}</h2>
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
      console.log('response', response);
      this.data.packageDetail = response;
    });
  }
}

</script>
