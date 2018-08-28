<template>
  <v-app id="app">
    <v-navigation-drawer
      persistent
      v-model="menuVisible"
      enable-resize-watcher
      temporary  
      app
    >
      <v-list>
        <v-list-tile>
          <v-toolbar-title>
            <img src="@/../art/logo.svg" alt="npmFrog" class="v-btn--icon">
            <span class="label">{{title}}</span>
          </v-toolbar-title>
        </v-list-tile>

        <v-list-tile
          value="true"
          v-for="(item, i) in navItems"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <About />
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
      <router-link to="/" class="home-button">
        <v-toolbar-title>
          <simple-svg
            :filepath="getIcon('logo-monochrome')"
            :width="`${btnIconSize}px`"
            :height="`${btnIconSize}px`"
          />
          <span class="label hidden-sm-and-down">{{title}}</span>
        </v-toolbar-title>    
      </router-link>
      <v-autocomplete
        ref="searchbar"
        placeholder="Search package..."
        prepend-inner-icon="search"
        clearable
        full-width
        hide-selected
        solo-inverted
        chips
        deletable-chips
        multiple
        :autofocus="$router.currentRoute.name === 'home'"
        persistent-hint
        return-object
        suffix="/"
        :hint="hasFocus ? `Press Ctrl+Enter to submit` : `Press '/' to focus search`"
        :item-text="getSearchItemText"
        :flat="!hasFocus"
        :items="searchItemsFiltered"
        append-icon="mdi-send"
        @click:append="onSearchSubmit"
        v-model="activeFilters"
        @input.native="onSearchInput"
        @input="filterSearchItems"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        @change="onSearchChange"
        @keydown.native.enter="onSearchEnter"
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
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span class="search--key grey--text text--darken-1">
                  {{data.item.key === 'keyword'? '#' : `${data.item.key}:`}}
                </span>
                <span v-html="data.item.value"></span>
              </v-list-tile-title>
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
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackagesService from '@/services/PackageService';
import Package from '@/model/Package';
import { SearchItem, SearchKey } from '@/model/SearchItem';
import router from '@/router';
import { setTimeout } from 'timers';
import { EventBus, Events } from '@/services/event-bus';
import About from '@/components/About.vue';

@Component({
  components: {
    About,
  },
})
export default class App extends Vue {
  public $refs!: {
    searchbar: any,
  };

  @Prop() private menuVisibleProp!: boolean;
  @Prop() private activeFiltersProp!: SearchItem[];
  @Prop() private clippedProp!: boolean;
  @Prop() private hasFocusProp!: boolean;
  @Prop() private titleProp!: string;
  private menuVisible: boolean;
  private activeFilters: SearchItem[];
  private searchItems: Array<SearchItem|Package>;
  private searchItemsFiltered: Array<SearchItem|Package>;
  private title: string = 'npmFrog';
  private clipped: boolean = true;
  private hasFocus: boolean = false;
  private btnIconSize: number = 36;
  private navItems: any[] = [];

  constructor() {
    super();
    this.menuVisible = false;
    this.activeFilters = [];
    this.searchItems = [];
    this.loadPackages();
    this.adaptContentSpacing();
    this.searchItemsFiltered = [];
    window.onresize = this.adaptContentSpacing;
    window.addEventListener('keypress', (e) => {
      if (String.fromCharCode(e.keyCode) === '/' || String.fromCharCode(e.keyCode) === '#') {
        if (!this.searchInput || e.target !== this.searchInput) {
          this.focusSearch();
          setTimeout(() => {
            this.searchInput.value = this.searchInput.value.slice(0, this.searchInput.value.length - 1);
            this.searchInput.dispatchEvent(new Event('input'));
          }, 0);
        }
      }
    });

    router.afterEach(this.fireSearchFilterEvent);
  }

  private get searchInput(): HTMLInputElement {
    return this.$refs.searchbar.$el.querySelector('input');
  }

  private loadPackages(): void {
    PackagesService.Instance.getPackages().then((packages: Package[]) => {
      this.searchItems = PackagesService.Instance.searchItems.concat(packages);
      this.filterSearchItems();
    });
  }

  private getSearchItemText(item: SearchItem|Package) {
    if (item instanceof Package) {
      return [item.name, item.description, item.author].concat(item.keywords);
    }
    const searchText = [`${item.key}:${item.value}`];
    if (item.key === SearchKey.KEYWORD) {
      searchText.push(`#${item.value}`);
    }
    return searchText;
  }

  private isPackage(item: SearchItem | Package): boolean {
    return item instanceof Package;
  }

  private filterSearchItems() {
    const results = this.searchItems.filter((item) => {
      if (!this.activeFilters.length) {
        // include everything, if no filter is selected:
        return true;
      }
      const filterMatchesExactly = this.activeFilters.every((filter) => {
        if (item instanceof Package) {
          let filterMatchesItem: boolean = false;
          switch (filter.key) {
            case SearchKey.AUTHOR:
              filterMatchesItem = filter.value === item.displayName;
              break;
            case SearchKey.KEYWORD:
              if (item.keywords !== undefined) {
                filterMatchesItem = item.keywords.indexOf(filter.value) !== -1;
              }
              break;
            default:
              filterMatchesItem = false;
          }
          return filterMatchesItem;
        } else {
          // include selected filter:
          return filter === item;
        }
      });
      return filterMatchesExactly;
    });

    const crossResults = this.searchItems.filter((item) => {
      if (item instanceof SearchItem) {
        for (const filteredPackage of results) {
          if (filteredPackage instanceof Package) {
            switch (item.key) {
              case SearchKey.AUTHOR:
                if (item.value === filteredPackage.displayName) {
                  return true;
                }
              case SearchKey.KEYWORD:
                if (filteredPackage.keywords && filteredPackage.keywords.indexOf(item.value) !== -1) {
                  return true;
                }
            }
          }
        }
      }
    });
    this.searchItemsFiltered = crossResults.concat(results);
    this.fireSearchFilterEvent();
  }

  private onSearchChange(values: Array<Package|SearchItem>) {
    this.hasFocus = true;
    for (const value of values) {
      if (value instanceof Package) {
        router.push(`/package/${value.name}`);
        this.$refs.searchbar.clearableCallback();
        setTimeout(this.$refs.searchbar.blur, 100);
      }
    }
    this.adaptContentSpacing();
  }

  private onSearchEnter(event) {
    if (event.ctrlKey) {
      this.onSearchSubmit(event);
    }
  }

  private onSearchSubmit(event) {
    const keywordFilter = this.activeFilters
      .filter((filter) => filter.key === SearchKey.KEYWORD)
      .map((filter) => {
        return filter.value;
      });
    router.push({path: '/'});
    this.$nextTick(this.fireSearchFilterEvent);
    this.$nextTick(this.$refs.searchbar.blur);

    // keep input value:
    const value = this.searchInput.value;
    setTimeout(() => {
      this.searchInput.value = value;
    }, 0);
  }

  private focusSearch() {
    this.$nextTick(this.$refs.searchbar.focus);
  }

  private onSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.fireSearchFilterEvent();
  }

  private fireSearchFilterEvent() {
    this.$nextTick(() => {
      EventBus.$emit(Events.FILTER_SEARCH, { filters: this.searchItemsFiltered, query: this.searchInput.value });
    });
  }

  private adaptContentSpacing() {
    setTimeout(() => {
      const contentElement = document.querySelector('.v-content') as HTMLElement;
      const toolbar = document.querySelector('.v-toolbar__content') as HTMLElement;
      contentElement.style.padding = `${toolbar.offsetHeight}px 0 0`;
    }, 0);
  }

  private getIcon(icon: string) {
    return require(`@/../art/${icon}.svg`);
  }
}

</script>

<style lang="scss">
@import 'assets/variables';

h1 {
  margin-bottom: .5em; 
}

h2,
h3,
h4,
h5,
h6 {
  margin: 1em 0 .5em 0;
}

a {
  display: inline-block;
  text-decoration: none;
  transition: $transition-fast;

  &:hover,
  &:focus {
    opacity: .7;
  }

  .v-icon {
    &,
    .theme--light & {
      &,
      .application & {
        color: inherit;
      }
    }
  }
}

.v-icon {
  font-size: inherit;
}

code,
kbd {
  &:after,
  &:before {
    letter-spacing: -1em; 
  }
}

// inline code
:not(pre) > code.hljs {
  display: inline;
  background: transparent;
  box-shadow: none;

  &,
  * {
    color: $color-code;
  }
}

code.hljs {
  white-space: pre;
}

.v-toolbar {

  &.theme--dark a {
    color: $color-link--dark;
    text-decoration: none;
  }

  &__content {
    height: auto !important;
    padding: .5em;
  }

  &__title {
    margin-right: 2em;
  }


  &__title {
    display: flex;
    align-items: center;
    
    .label {
      margin-left: .5em;
    }

    .simple-svg {
      fill: $color-white;
    }
  }
  
  .v-input__icon--append .v-icon {
    opacity: 0;
    visibility: hidden;
  }

  .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
    opacity: 1;
    visibility: visible;
    transform: initial;
  }

  .v-input__control {
    flex-direction: row;

    .v-input__slot {
      margin-bottom: 0;
      width: auto;
      flex-grow: 1;
      max-width: 700px;
    }

    .v-text-field__details {
      flex-grow: 0;
      width: auto;
      display: block;
      @media screen and (max-width: map-get($grid-breakpoints, md)) {
        display: none;
      }
    }
  }
}

.search--key {
  margin-right: -3px;
}

.v-text-field {
  &__suffix {
    border: 1px solid;
    border-radius: 3px;
    width: 1em;
  }
}

.footer {
  height: auto !important;
  display: block;

  > div {
    padding: 5px;
  }
}

.subheading {
  color: $color-gray-medium;
}

</style>
