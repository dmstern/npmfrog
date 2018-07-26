<template>
  <div class="packages">
    <h2>Packages</h2>
    <ul>
      <li v-for="(metaData, packageName) in packages" :key='packageName'>
        {{ packageName }} (by {{metaData.displayName}})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModulesService from '@/services/ModulesService';

interface PackagesResponse {
  [key: string]: object;
}

@Component
export default class Modules extends Vue {
  @Prop() private packagesProp!: any;
  private packages: any = this.packagesProp;

  constructor() {
    super();
    this.getModules();
  }

  public async getModules() {
    ModulesService.fetchModules().then((response) => {
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
        Object.assign(packagesResponse[packageName], {
          displayName: displayName,
        });
        this.packages[packageName] = packagesResponse[packageName];
      }
    });
  }
}
</script>
