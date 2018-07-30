<template>
  <div class="packages">
    <h2>Artifactory is keinbockly serving {{packages.length}} npm packages</h2>
    <span v-if="!packages.length">{{startMsg}}</span>

    <md-list v-else class="md-triple-line package-list">

      <span v-for="(metaData, packageName) in packages" :key='packageName'>
        <md-list-item v-on:click="$router.push(`package/${metaData.name}`)">

            <div class="md-list-item-text">
              <span class="package-list--package-name">{{ metaData.name }}</span>
              <span class="package-list--description">{{metaData.description}}</span>
              <span class="package-list--keywords">
                <md-badge v-for="keyword in metaData.keywords" :key="keyword" class="md-square" v-bind:md-content="keyword" />
              </span>
           
            </div>

            <div class="package-list--right">

              <div class="package-list--by">crafted by</div>
              <div class="package-list--author">
                <span class="package-list--author-name">{{metaData.displayName}}</span>
                <md-avatar>
                  <img src="https://placeimg.com/40/40/people/1" alt="People">
                </md-avatar>
              </div>
            </div>
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
.md-list-item-text {

  align-self: flex-start;

  & > * {
    width: 100%;
  }
}

.package-list {

  .md-list-item-content {
    padding: .5em 0;
  }

  & &--package-name {
    font-weight: 500;
    font-size: 1.2em;
  }

  &--right {
    text-align: right;
    margin-top: auto;
  }

  &--author {
    display: flex;
    font-family: $monospace;
    font-weight: bold;
    font-size: $package-list--author--font-size;

    &,
    .md-list.md-theme-default.md-triple-line .md-list-item-text &,
    .md-list.md-theme-default.md-triple-line .md-list-item-text &:nth-child(3) {
      color: $color-gray-light;
    }

    &-name {
      align-self: flex-end;
      padding-left: .8em;
      margin-right: .8em;
    }

    .md-avatar {
      width: #{$package-list--avatar--width}px;
      height: #{$package-list--avatar--width}px;
      min-width: initial;
      margin-left: auto;
    }
  }

  & &--by {
    padding-bottom: .3em;
    color: $color-gray-extralight;
    font-size: $package-list--author--font-size;
  }

  & &--description {
    padding: .5em 0 .5em 0;
    color: $color-gray-medium;
  }

  & &--keywords {
    width: auto;

    .md-badge {
      display: inline-block;
      margin: .2em .5em 0 0;
      background-color: $color-gray-extralight;
      color: $color-gray-medium;
      font-size: .8em;
    }
  }

}

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackageService from '@/services/PackageService';
import { PackagesResponse } from '@/model/PackageResponse';
import PackagesService from '@/services/PackageService';
import Package from '@/model/Package';

@Component
export default class Packages extends Vue {
  @Prop() private startMsg!: string;
  @Prop() private packagesProp!: Package[];
  private packages: Package[] = this.packagesProp;

  constructor() {
    super();
    this.packages = [];
    this.loadPackages();
  }

  // public searched(packages: PackagesResponse): PackagesResponse {
  //   const filteredPackageNames = Object.keys(packages).filter((key) => {
  //     return key.match('oen') != null; // TODO: replace with real search string property
  //   });
  //   const resultPackages: PackagesResponse = {};
  //   for (const packageName of filteredPackageNames) {
  //     resultPackages[packageName] = packages[packageName];
  //   }
  //   return resultPackages;
  // }

  private async loadPackages() {
    this.packages = await PackagesService.Instance.getPackages();
  }
}

</script>
