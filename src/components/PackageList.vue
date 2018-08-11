<template>
  <div class="packages">
    <span v-if="!packages.length">{{startMsg}}</span>

    <v-list subheader three-line v-else class="package-list">
        <v-subheader class="title">Artifactory is keinbockly serving {{packages.length}} npm packages</v-subheader>
          <template v-for="(item, index) in packages">
            <v-list-tile
              :key='item.name'
              avatar
              ripple
              @click="$router.push(`package/${item.name}`)"
            >
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-medium">{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.description}}</v-list-tile-sub-title>
                <v-list-tile-sub-title class="package-list--keywords">
                  <v-chip v-for="keyword in item.keywords" :key="keyword" small>{{keyword}}</v-chip>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <div class="package-list--by">crafted by</div>
                <div class="package-list--author">
                  <span class="package-list--author-name">{{item.displayName}}</span>
                  <v-avatar size="32">
                    <img src="https://placeimg.com/40/40/people/1" alt="People">
                  </v-avatar>
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

  &--keywords {
    min-height: 2em;
  }

  &--author {
    display: flex;
    font-family: $monospace;
    font-weight: bold;
    font-size: $package-list--author--font-size;
    color: $color-gray-light;

    &-name {
      align-self: flex-end;
      padding-left: .8em;
      margin-right: .8em;
      line-height: 1em;
    }
  }

  & &--by {
    padding-bottom: .3em;
    color: $color-gray-light;
    font-size: $package-list--author--font-size;
  }

 .v-list__tile__sub-title {
   .v-chip {
     &:first-child {
       margin-left: 0;
     }
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

  private async loadPackages() {
    this.packages = await PackagesService.Instance.getPackages();
  }
}

</script>
