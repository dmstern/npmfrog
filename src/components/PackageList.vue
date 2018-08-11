<template>
  <div class="packages">
    <span v-if="!packages.length">{{startMsg}}</span>

    <v-list subheader two-line v-else class="package-list">
        <v-subheader class="title">Artifactory is keinbockly serving {{packages.length}} npm packages</v-subheader>
          <template v-for="(item, index) in packages">
            <v-list-tile
              :key='item.name'
              avatar
              ripple
              @click="$router.push(`package/${item.name}`)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{item.description}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  <v-chip v-for="keyword in item.keywords" :key="keyword" small>{{keyword}}</v-chip>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <div class="package-list--right">

                  <div class="package-list--by">crafted by</div>
                  <div class="package-list--author">
                    <span class="package-list--author-name">{{item.displayName}}</span>
                    <v-avatar>
                      <img src="https://placeimg.com/40/40/people/1" alt="People">
                    </v-avatar>
                  </div>
                </div>
              </v-list-tile-action>

            </v-list-tile>
            <v-divider
              v-if="index + 1 < packages.length"
              v-bind:key="index"
            ></v-divider>
          </template>
        </v-list>
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
  //   const filteredindexs = Object.keys(packages).filter((key) => {
  //     return key.match('oen') != null; // TODO: replace with real search string property
  //   });
  //   const resultPackages: PackagesResponse = {};
  //   for (const index of filteredindexs) {
  //     resultPackages[index] = packages[index];
  //   }
  //   return resultPackages;
  // }

  private async loadPackages() {
    this.packages = await PackagesService.Instance.getPackages();
  }
}

</script>
