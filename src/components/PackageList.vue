<template>
  <div class="packages">
    <LoadingSpinner v-if="packages.loading" :msg="startMsg"/>
    <v-list subheader three-line v-else class="package-list">
      <v-subheader 
        class="title"
        v-if="config">Found {{packages.data.length}}/{{packages.all.length}} npm packages on &nbsp;
        <ExternalLink
          :href="`http${config.artifactory.https? 's' : ''}://${config.artifactory.host}`"
          :text="config.artifactory.host">
        </ExternalLink>
      </v-subheader>
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
              <CrafterAvatar
                v-for="(crafter, index) in item.crafters"
                :key="index"
                :crafter="crafter">
              </CrafterAvatar>
            </div>
          </v-list-tile-action>

        </v-list-tile>
        <v-divider
          v-if="index + 1 < packages.data.length"
          v-bind:key="index"
        >
        </v-divider>
      </template>
      <v-btn
        fixed
        dark
        fab
        bottom
        right
        color="accent"
        @click="$router.push('/howto')"
        title="Publish a new package"
      >
        <v-icon>{{$vuetify.icons.upload}}</v-icon>
      </v-btn>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DataStore from '@/services/DataStore';
import { PackagesResponse } from '../../types/PackageResponse';
import Package from '../../types/Package';
import { EventBus, Events } from '@/services/event-bus';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import CrafterAvatar from '@/components/CrafterAvatar.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import Searchable from '../../types/Searchable';
import Config from 'types/Config';

@Component({
  components: {
    LoadingSpinner,
    CrafterAvatar,
    ExternalLink,
  },
})
export default class Packages extends Vue {
  @Prop() private startMsg!: string;
  @Prop()
  private packagesProp!: {
    all: Package[];
    data: Package[];
    loading: boolean;
  };
  private config: Config | {};
  private packages: {
    all: Package[];
    data: Package[];
    loading: boolean;
  } = this.packagesProp;

  constructor() {
    super();
    this.config = {};
    this.packages = {
      all: [],
      data: [],
      loading: true,
    };

    this.loadConfig();

    EventBus.$on(
      [Events.FILTER_SEARCH, Events.TRIGGER_FILTER_SEARCH],
      async (args: { filters: Searchable[]; query: string }) => {
        this.packages.loading = true;
        this.packages.all = await DataStore.Instance.getPackages();
        this.packages.loading = false;
        this.packages.data = this.packages.all
          .filter(item => args.filters.every(filter => filter.matches(item, this.packages.all)))
          .filter(item => {
            if (!args.query) {
              return true;
            }
            return item.matchesPattern(args.query);
          });
      },
    );
  }

  private loadConfig(): void {
    DataStore.Instance.getConfig().then(config => {
      if (config) {
        Object.assign(this.config, config);
      }
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
  padding-bottom: 88px;

  .v-list__tile__content {
    padding: 0.4em 0;
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
      margin-left: 0.5em;
    }
  }

  & &--by {
    padding-bottom: 0.3em;
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
