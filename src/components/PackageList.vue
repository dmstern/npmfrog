<template>
  <div class="packages">
    <span v-if="!packages.data.length">{{startMsg}}</span>

    <v-list subheader three-line v-else class="package-list">
        <v-subheader class="title">Found {{packages.data.length}} npm packages on {{artifactoryUrl}}</v-subheader>
          <template v-for="(item, index) in packages.data">
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
              v-if="index + 1 < packages.data.length"
              v-bind:key="index"
            ></v-divider>
          </template>
        </v-list>
  </div>
</template>

<style lang="scss">
@import '../assets/variables';

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
import { EventBus, Events } from '@/services/event-bus';
// import * as config from '@/../server/config-service';

@Component
export default class Packages extends Vue {
  @Prop() private startMsg!: string;
  @Prop() private artifactoryUrlProp!: string;
  @Prop() private packagesProp!: {
    all: Package[],
    data: Package[],
    searchQueryText: string,
  };
  private artifactoryUrl: string = this.artifactoryUrlProp;
  private packages: {
    all: Package[],
    data: Package[],
    searchQueryText: string,
  } = this.packagesProp;

  constructor() {
    super();
    this.artifactoryUrl = 'artifactory.init.de'; // TODO: load from config
    this.packages = {
      all: [],
      data: [],
      searchQueryText: '',
    };

    EventBus.$on(Events.FILTER_SEARCH, async ({filters, query}) => {
      this.packages.all = await this.loadPackages();
      this.packages.data = this.packages.all.filter((item) => filters.indexOf(item) >= 0).filter((item) => {
        if (!query) {
          return true;
        }
        const pattern = new RegExp(query.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), 'gi');
        return `/${item.name}`.match(pattern) ||
          item.displayName.match(pattern) ||
          `author:${item.displayName}`.match(pattern) ||
          item.description && `/${item.description}`.match(pattern) ||
          item.keywords && item.keywords.some((keyword) => {
            if (`#${keyword}`.match(pattern)) {
              return true;
            } else {
              return false;
            }
          });
      });
    });
  }

  private async loadPackages(): Promise<Package[]> {
    return PackagesService.Instance.getPackages().then((packages) => {
      return packages;
    });
  }
}

</script>
