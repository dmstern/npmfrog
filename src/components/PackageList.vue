<template>
  <div class="packages">
    <LoadingSpinner v-if="!packages.data.length" :msg="startMsg"/>
    <v-list subheader three-line v-else class="package-list">
        <v-subheader class="title">Found {{packages.data.length}}/{{packages.all.length}} npm packages on {{artifactoryUrl}}</v-subheader>
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
                <v-list-tile-sub-title class="last-published-version-line">
                  <span>{{item.distTags.latest}}</span>
                  <span>Published <timeago :datetime="item.time.modified"></timeago></span>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <div class="package-list--by">crafted by</div>
                <div class="package-list--author">
                  <CrafterAvatar v-for="(crafter, index) in item.crafters" :key="index" :crafter="crafter"></CrafterAvatar>
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DataStore from '@/services/DataStore';
import { PackagesResponse } from '@/model/PackageResponse';
import Package from '@/model/Package';
import { EventBus, Events } from '@/services/event-bus';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import CrafterAvatar from '@/components/CrafterAvatar.vue';

@Component({
  components: {
    LoadingSpinner,
    CrafterAvatar,
  },
})
export default class Packages extends Vue {
  @Prop() private startMsg!: string;
  @Prop() private artifactoryUrlProp!: string;
  @Prop() private packagesProp!: {
    all: Package[],
    data: Package[],
    searchQueryText: string,
  };
  private artifactoryUrl: string | undefined = this.artifactoryUrlProp;
  private packages: {
    all: Package[],
    data: Package[],
    searchQueryText: string,
  } = this.packagesProp;

  constructor() {
    super();
    this.artifactoryUrl = '';
    this.packages = {
      all: [],
      data: [],
      searchQueryText: '',
    };

    this.loadConfig();

    EventBus.$on(Events.FILTER_SEARCH, async ({filters, query}) => {
      this.packages.all = await this.loadPackages();
      this.packages.data = this.packages.all.filter((item) => filters.indexOf(item) >= 0).filter((item) => {
        if (!query) {
          return true;
        }
        const pattern = new RegExp(query.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), 'gi');
        const someCrafterMatches = item.crafters.some((crafter) => {
          if (
            crafter.name &&
            (crafter.name.match(pattern) ||
            `crafter:${crafter.name}`.match(pattern) ||
            `author:${crafter.name}`.match(pattern))
            ) {
              return true;
            }
          return false;
        });
        return `/${item.name}`.match(pattern) ||
          someCrafterMatches ||
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

  private loadConfig() {
    DataStore.Instance.getConfig().then((config) => {
      this.artifactoryUrl = config.artifactory.host;
    });
  }

  private async loadPackages(): Promise<Package[]> {
    return DataStore.Instance.getPackages().then((packages) => {
      return packages;
    });
  }
}

</script>

<style lang="scss">
@import '../assets/variables';

.v-list--three-line .v-list__tile {
  height: auto;
}

.package-list {

  .v-list__tile__content {
    padding: .4em 0;
  }

  &--keywords {
    min-height: 2em;
  }

  .v-list__tile__action--stack {
    align-self: flex-end;
  }

  &--author {
    display: flex;

    .CrafterAvatar {
      margin-left: .5em;
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
