<template>
  <v-app id="app">
    <v-navigation-drawer
      persistent
      v-model="menuVisible"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      color="primary"
      dark
      fixed
    >
      <v-btn icon @click.stop="menuVisible = !menuVisible">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>      
      <v-autocomplete
        ref="searchbar"
        label="Search package..."
        prepend-inner-icon="search"
        clearable
        hide-selected
        solo-inverted
        chips
        deletable-chips
        multiple
        hide-details
        :item-text="getSearchString"
        :item-value="getSearchString"
        :flat="!hasFocus"
        :items="searchItems"
        v-model="selectedPackage"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        @change="onSearchChange"
      >
        <template slot="selection" slot-scope="data">
          <template v-if="!isPackage(data.item)">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              class="v-chip--select-multi highlight"
              :close="true"
              :light="hasFocus"
              solo-inverted
              @input="data.parent.selectItem(data.item)"
            >
              <v-avatar>
                <v-icon v-if="data.item.key === 'author'">account_circle</v-icon>
                <v-icon v-if="data.item.key === 'keyword'">local_offer</v-icon>
                <v-icon v-if="data.item.key === 'description'">subject</v-icon>
              </v-avatar>
              <v-list-tile-sub-title> {{ data.item.value }}</v-list-tile-sub-title>
            </v-chip>
          </template>
        </template>
        <template slot="item" slot-scope="data">
          <template v-if="isPackage(data.item)">
            <v-list-tile-avatar>
              <v-icon>mdi-package-variant-closed</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title><strong v-html="data.item.name"></strong></v-list-tile-title>
              <v-list-tile-sub-title v-html="data.item.description"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon>mdi-arrow-right-box</v-icon>
          </template>
          <template v-else>
            <v-list-tile-avatar>
              <v-icon v-if="data.item.key === 'author'">account_circle</v-icon>
              <v-icon v-if="data.item.key === 'keyword'">local_offer</v-icon>
              <v-icon v-if="data.item.key === 'description'">subject</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title><span class="search--key grey--text text--darken-1">{{data.item.key}}:</span><span v-html="data.item.value"></span></v-list-tile-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon>mdi-arrow-top-left</v-icon>
          </template>
        </template>
      </v-autocomplete>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
       <router-view/> 
      <!-- Hello Vue! -->
    </v-content>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} by ]init[ PixelSchubser Unit</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackagesService from '@/services/PackageService';
import Package from '@/model/Package';
import { SearchItem, SearchKey } from '@/model/SearchItem';
import router from '@/router';
import { setTimeout } from 'timers';

@Component
export default class App extends Vue {
  public $refs!: {
    searchbar: any,
  };

  @Prop() private menuVisibleProp!: boolean;
  @Prop() private selectedPackageProp!: string|null;
  @Prop() private clippedProp!: boolean;
  @Prop() private hasFocusProp!: boolean;
  @Prop() private titleProp!: string;
  private menuVisible: boolean;
  private selectedPackage: string|null;
  private searchItems: Array<SearchItem|Package>;
  private title: string = 'npmFrog';
  private clipped: boolean = true;
  private hasFocus: boolean = false;
  private items: any[] = [{
    icon: 'bubble_chart',
    title: 'Inspire',
  }];

  constructor() {
    super();
    this.menuVisible = false;
    this.selectedPackage = null;
    this.searchItems = [];
    this.loadPackages();
    this.adaptContentSpacing();
    window.onresize = this.adaptContentSpacing;
  }

  private loadPackages(): void {
    PackagesService.Instance.getPackages().then((packages: Package[]) => {
      this.searchItems = PackagesService.Instance.searchItems.concat(packages);
    });
  }

  private getSearchString(item: any) {
    return JSON.stringify(item);
  }

  private isPackage(item: SearchItem | Package): boolean {
    return item instanceof Package;
  }

  private onSearchChange(values: string[]) {
    for (const value of values) {
      const item = JSON.parse(value);
      const isPackage = item.name !== undefined;
      if (isPackage) {
        router.push(`/package/${item.name}`);
        this.$refs.searchbar.clearableCallback();
        setTimeout(this.$refs.searchbar.blur, 100);
      }
    }
    this.adaptContentSpacing();
  }

  private adaptContentSpacing() {
    setTimeout(() => {
      const contentElement = document.querySelector('.v-content') as HTMLElement;
      const toolbar = document.querySelector('.v-toolbar__content') as HTMLElement;
      const footer = document.querySelector('.v-footer') as HTMLElement;
      contentElement.style.padding = `${toolbar.offsetHeight}px 0 ${footer.offsetHeight}px`;
    }, 0);
  }
}

</script>

<style lang="scss">
@import 'assets/variables';

.v-navigation-drawer {
  .v-list {
    margin-top: 4em;
  }
}

.v-toolbar__content {
  height: auto !important;
  padding: .5em;
}

.v-toolbar__title {
  margin-right: 2em;
}

.search--key {
  display: none;
  font-size: .9em;
}

</style>
