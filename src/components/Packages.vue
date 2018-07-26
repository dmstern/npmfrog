<template>
  <div class="packages">
    <h2>Packages</h2>
    <span v-if="!Object.keys(packages).length">{{startMsg}}</span>
    <!-- <ul v-else>
      <li v-for="(metaData, packageName) in packages" :key='packageName'>
        <router-link :to="`/package/${packageName}`">{{ packageName }} (by {{metaData.displayName}})</router-link>
      </li> -->
    <!-- </ul> -->

    <md-list v-else class="md-triple-line package-list">

      <span v-for="(metaData, packageName) in packages" :key='packageName'>
        <md-list-item>
          <!-- <router-link :to="`/package/${packageName}`"> -->

            <div class="md-list-item-text">
              <span class="package-list--package-name">{{ packageName }}</span>
              <span class="package-list--description">I'll be in your neighborhood doing errands this week. Do you want to meet?</span>
              <span class="package-list--author">
                <md-avatar>
                  <img src="https://placeimg.com/40/40/people/1" alt="People">
                </md-avatar>
                <span class="package-list--author-name">{{metaData.displayName}}</span>
              </span>
            </div>

            <md-button class="md-icon-button md-list-action">
              <md-icon class="md-primary">star</md-icon>
            </md-button>
          <!-- </router-link> -->
        </md-list-item>

        <md-divider class="md-full"></md-divider>
      </span>
    </md-list>

  </div>
</template>

<style lang="scss">
@import '../assets/variables';

.md-list-item-text * {
  width: auto;
}
.md-list-item-text > * {
  width: 100%;
}

.package-list {

  .md-list-item-container {
    padding: 0.5em 0;
  }

  & &--package-name {
    font-weight: bold;
  }

  &--author {
    display: flex;

    .md-list.md-theme-default.md-triple-line .md-list-item-text &:nth-child(3) {
      color: inherit;
    }

    &-name {
      align-self: flex-end;
      padding-left: 0.8em;
    }

    .md-avatar {
      width: #{$package-list--avatar--width}px;
      height: #{$package-list--avatar--width}px;
      min-width: initial;
    }
  }

  & &--description {
    padding: 0.7em 0;
    color: var(--md-theme-default-text-accent-on-background, rgba(0,0,0,0.54));
  }

}

</style>


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
        let displayName: any = '';
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
