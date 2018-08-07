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
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-autocomplete
        label="Search package..."
        prepend-inner-icon="search"
        clearable
        solo-inverted
        chips
        deletable-chips
        item-text="displayString"
        item-value="searchString"
        multiple
        :flat="!hasFocus"
        :items="searchItems"
        v-model="selectedPackage"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        class="hidden-sm-and-down"
        hide-details
      >
        <template slot="selection" slot-scope="data">
          <v-chip
            :selected="data.selected"
            :disabled="data.disabled"
            :key="data.item.searchString"
            class="v-chip--select-multi "
            :close="true"
          ><!--@input="data.parent.selectItem(data.item)"-->
            <v-avatar>
              <v-icon v-if="data.item.key === 'author'">account_circle</v-icon>
              <v-icon v-if="data.item.key === 'keyword'">local_offer</v-icon>
              <v-icon v-if="data.item.key === 'description'">subject</v-icon>
            </v-avatar>
            {{ data.item.displayString }}
          </v-chip>
        </template>
        <template
          slot="item"
          slot-scope="data"
        >
          <template>
            <v-list-tile-avatar>
              <v-icon v-if="data.item.key === 'author'">account_circle</v-icon>
              <v-icon v-if="data.item.key === 'keyword'">local_offer</v-icon>
              <v-icon v-if="data.item.key === 'description'">subject</v-icon>
              <v-icon v-if="data.item.key === 'name'">package-variant</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title v-html="data.item.key"></v-list-tile-sub-title>
              <v-list-tile-title v-html="data.item.displayString"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-autocomplete>
      <v-spacer></v-spacer>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <!-- <router-view/> -->
      Hello Vue!
    </v-content>
    <v-footer app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackagesService from '@/services/PackageService';
import Package from '@/model/Package';
import { SearchItem, SearchKey } from '@/model/SearchItem';

@Component
export default class App extends Vue {
  @Prop() private menuVisibleProp!: boolean;
  @Prop() private selectedPackageProp!: string|null;
  @Prop() private clippedProp!: boolean;
  @Prop() private hasFocusProp!: boolean;
  // @Prop() private fixedProp!: boolean;
  // @Prop() private miniVariantProp!: boolean;
  @Prop() private titleProp!: string;
  private menuVisible: boolean;
  private selectedPackage: string|null;
  private searchItems: Array<string|{}>;
  private title: string = 'npmFrog';
  private clipped: boolean = true;
  private hasFocus: boolean = false;
  // private fixed: boolean = false;
  private items: any[] = [{
    icon: 'bubble_chart',
    title: 'Inspire',
  }];
  // private miniVariant: boolean = false;

  constructor() {
    super();
    this.menuVisible = false;
    this.selectedPackage = null;
    this.searchItems = [];
    this.loadPackages();
  }

  private loadPackages(): void {
    PackagesService.Instance.getPackages().then((packages) => {
      this.searchItems = PackagesService.Instance.searchItems;
    });
  }
}
</script>

<style lang="scss">
.v-navigation-drawer {
  .v-list {
    margin-top: 4em;
  }
}

.v-toolbar__title {
  margin-right: 2em;
}
</style>
