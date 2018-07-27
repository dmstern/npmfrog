<template>
  <div class="packages">
    <h2>Packages</h2>
    <span v-if="!Object.keys(packages).length">{{startMsg}}</span>

    <md-list v-else class="md-triple-line package-list">

      <span v-for="(metaData, packageName) in packages" :key='packageName'>
        <md-list-item v-on:click="$router.push(`package/${packageName}`)">

            <div class="md-list-item-text">
              <span class="package-list--package-name">{{ packageName }}</span>
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
.md-list-item-text > * {
  width: 100%;
}

.package-list {

  .md-list-item {
    padding: .5em 0;
  }

  & &--package-name {
    font-weight: 500;
    font-size: 1.2em;
  }

  &--right {
    text-align: right;
    margin-top: auto;
    margin-bottom: 0;
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
      margin: .2em .5em .5em 0;
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
