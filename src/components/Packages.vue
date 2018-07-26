<template>
  <div class="packages">
    <h2>Packages</h2>
    <!-- TODO if packages is typeof string, render string, else loop -->
    <ul>
      <li v-for="(metaData, packageName) in packages" :key='packageName'>
        <router-link :to="`/package/${packageName}`">{{ packageName }} (by {{metaData.displayName}})</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackageService from '@/services/PackageService';

interface PackagesResponse {
  [key: string]: object;
}

@Component
export default class Packages extends Vue {
  @Prop() private packagesProp!: any;
  private packages: any = this.packagesProp;

  constructor() {
    super();
    this.getPackages();
  }

  public async getPackages() {
    PackageService.fetchPackages().then((response) => {
      const packagesResponse: PackagesResponse | string = response.data;
      const packageNames: any[] = Object.keys(packagesResponse).filter((key) => !key.startsWith('_'));

      this.packages = {};
      const authorKey: any = 'author';
      const nameKey: any = 'name';
      const displayNameKey: any = 'displayName';
      for (const packageName of packageNames) {
        const displayName =
          (
            packagesResponse[packageName][authorKey]
            && packagesResponse[packageName][authorKey][nameKey]
          )
          ? packagesResponse[packageName][authorKey][nameKey]
          : packagesResponse[packageName][authorKey];
        Object.assign(packagesResponse[packageName], {displayName});
        this.packages[packageName] = packagesResponse[packageName];
      }
    });
  }
}
</script>
