<template>
  <div class="packages">
    <h2>Packages</h2>
    <span v-if="!Object.keys(packages).length">{{startMsg}}</span>
    <ul v-else>
      <li v-for="(metaData, packageName) in packages" :key='packageName'>
        <router-link :to="`/package/${packageName}`">{{ packageName }} (by {{metaData.displayName}})</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackageService from '@/services/PackageService';
import { PackagesResponse } from '@/api/PackageResponse';

@Component
export default class Packages extends Vue {
  @Prop() private startMsg!: string;
  @Prop() private packagesProp!: PackagesResponse;
  private packages: PackagesResponse = this.packagesProp;

  constructor() {
    super();
    this.packages = {};
    this.getPackages();
  }

  public async getPackages() {
    PackageService.fetchPackages().then((response) => {
      const packagesResponse: PackagesResponse = response.data;
      const packageNames: any[] = Object.keys(packagesResponse).filter((key) => !key.startsWith('_'));

      this.packages = {};
      for (const packageName of packageNames) {
        let displayName: any = "";
        if (packagesResponse[packageName].author) {
          displayName = packagesResponse[packageName].author!.name
            ? packagesResponse[packageName].author!.name
            : packagesResponse[packageName].author;
        }
        Object.assign(packagesResponse[packageName], {displayName});
        this.packages[packageName] = packagesResponse[packageName];
      }
    });
  }
}
</script>
