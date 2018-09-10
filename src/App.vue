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

        <router-link
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.target"
        >
          <v-list-tile
            value="true"
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
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
        <v-icon>{{$vuetify.icons.menu}}</v-icon>
      </v-btn>
      <v-toolbar-title
        @click="goHome"
        class="home-button"
      >
        <img src="@/../art/logo.svg" alt="npmFrog" class="v-btn--icon">
        <span class="label hidden-sm-and-down">{{title}}</span>
      </v-toolbar-title>
      <v-autocomplete
        ref="searchbar"
        placeholder="Search package..."
        :prepend-inner-icon="$vuetify.icons.search"
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
        :append-icon="$vuetify.icons.send"
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
              <CrafterAvatar v-if="isCrafter(data.item)" :crafter="data.item"></CrafterAvatar>
              <v-avatar v-else>
                <v-icon>{{$vuetify.icons.tag}}</v-icon>
              </v-avatar>
              <v-list-tile-sub-title> {{ isCrafter(data.item) ? data.item.name : data.item.value }}</v-list-tile-sub-title>
            </v-chip>
          </template>
        </template>
        <template slot="item" slot-scope="data">
          <template v-if="isPackage(data.item)">
            <v-list-tile-avatar>
              <v-icon>{{$vuetify.icons.package}}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title><strong v-html="data.item.name"></strong></v-list-tile-title>
              <v-list-tile-sub-title v-html="data.item.description"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon>{{$vuetify.icons.goTo}}</v-icon>
          </template>
          <template v-else>
            <v-list-tile-avatar>
              <CrafterAvatar v-if="isCrafter(data.item)" :crafter="data.item"></CrafterAvatar>
              <v-icon v-else v-text="$vuetify.icons.tag"></v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span class="search--key grey--text text--darken-1">
                  {{
                    isCrafter(data.item)
                    ? `@`
                    : `#`
                  }}
                </span>
                <span v-html="isCrafter(data.item) ? data.item.name : data.item.value"></span>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon>{{$vuetify.icons.arrowTopLeft}}</v-icon>
          </template>
        </template>
      </v-autocomplete>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
       <router-view/> 
         <v-snackbar
          v-model="error.show"
          bottom
          right
          auto-height
          color="error"
          :timeout="0"
        >
          {{ error.msg }}
          <v-btn
            dark
            flat
            @click="error.show = false"
          >
            Close
          </v-btn>
        </v-snackbar>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DataStore from '@/services/DataStore';
import Package from '../types/Package';
import { Tag } from '../types/Tag';
import router from '@/router';
import { setTimeout } from 'timers';
import { EventBus, Events, Errors } from '@/services/event-bus';
import About from '@/components/About.vue';
import CrafterAvatar from '@/components/CrafterAvatar.vue';
import Crafter from '../types/Crafter';
import Searchable from '../types/Searchable';

@Component({
  components: {
    About,
    CrafterAvatar,
  },
})
export default class App extends Vue {
  public $refs!: {
    searchbar: any,
  };

  @Prop() private menuVisibleProp!: boolean;
  @Prop() private activeFiltersProp!: Searchable[];
  @Prop() private clippedProp!: boolean;
  @Prop() private hasFocusProp!: boolean;
  @Prop() private titleProp!: string;
  private menuVisible: boolean;
  private activeFilters: Searchable[];
  private searchItems: Searchable[];
  private searchItemsFiltered: Searchable[];
  private title: string = 'npmFrog';
  private clipped: boolean = true;
  private hasFocus: boolean = false;
  private btnIconSize: number = 36;
  private navItems: Array<{ icon: string, title: string, target: string }> = [
    {
      icon: 'email',
      title: 'howto',
      target: 'howto',
    },
  ];
  private error: {
    show: boolean,
    msg: string,
  } = {
    show: false,
    msg: '',
  };

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

    EventBus.$on(Errors.SERVER_ERROR, (error) => {
      const res = error.response;
      this.error.show = true;
      this.error.msg = res.data;
    });

    EventBus.$on(Events.TRIGGER_FILTER_SEARCH, (args: { filters: Searchable[], query: string }) => {
      if (this.$refs.searchbar && this.$refs.searchbar.selectedItems) {
        while (this.$refs.searchbar.selectedItems.length > 0) {
          this.$refs.searchbar.selectedItems.pop();
        }
        this.$refs.searchbar.selectedItems.push(...args.filters);
      }
    });

  }

  private get searchInput(): HTMLInputElement {
    return this.$refs.searchbar.$el.querySelector('input');
  }

  private goHome(): void {
    router.push('/');
    this.$refs.searchbar.reset();
  }

  private loadPackages(): void {
    DataStore.Instance.getPackages().then((packages: Package[]) => {
      this.searchItems =
        DataStore.Instance.searchItems
        .concat(DataStore.Instance.crafters)
        .concat(packages);
      this.filterSearchItems();
    });
  }

  private getSearchItemText(item: Searchable): string[] {
    if ('getSearchItemText' in item) {
      return item.getSearchItemText();
    }
    return [];
  }

  private isPackage(item: Searchable): boolean {
    return item instanceof Package;
  }

  private isCrafter(item: Searchable): boolean {
    return item instanceof Crafter;
  }

  private filterSearchItems(): void {
    // filter results for packages:
    const packages: Package[] = [];
    for (const result of this.searchItems) {
      if (result instanceof Package) {
        packages.push(result);
      }
    }

    this.searchItemsFiltered = this.searchItems.filter((item) => {
      if (!this.activeFilters.length) {
        // include everything, if no filter is selected:
        return true;
      }
      return this.activeFilters.every((filter) => filter.matches(item, packages));
    });

    this.fireSearchFilterEvent();
  }

  private onSearchChange(values: Searchable[]): void {
    this.hasFocus = true;
    for (const value of values) {
      if (value instanceof Package) {
        router.push(`/package/${value.name}`);
        this.$refs.searchbar.selectedItems.pop();
        setTimeout(this.$refs.searchbar.blur, 100);
      }
    }
    this.adaptContentSpacing();
  }

  private onSearchEnter(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      this.onSearchSubmit(event);
    }
  }

  private onSearchSubmit(event?: Event): void {
    router.push({path: '/'});
    this.$nextTick(this.fireSearchFilterEvent);
    this.$nextTick(this.$refs.searchbar.blur);

    // keep input value:
    const value = this.searchInput.value;
    setTimeout(() => {
      this.searchInput.value = value;
    }, 0);
  }

  private focusSearch(): void {
    this.$nextTick(this.$refs.searchbar.focus);
  }

  private onSearchInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.fireSearchFilterEvent();
  }

  private fireSearchFilterEvent(): void {
    this.$nextTick(() => {
      EventBus.$emit(Events.FILTER_SEARCH, { filters: this.activeFilters, query: this.searchInput.value });
    });
  }

  private adaptContentSpacing(): void {
    setTimeout(() => {
      const contentElement = document.querySelector('.v-content') as HTMLElement;
      const toolbar = document.querySelector('.v-toolbar__content') as HTMLElement;
      contentElement.style.padding = `${toolbar.offsetHeight}px 0 0`;
    }, 0);
  }

  private getIcon(icon: string): NodeRequire {
    return require(`@/../art/${icon}.svg`);
  }
}

</script>

<style lang="scss">
@import "assets/variables";

h1 {
  margin-bottom: 0.5em;
}

h2,
h3,
h4,
h5,
h6 {
  margin: 1em 0 0.5em 0;
}

a {
  // display: inline-block;
  text-decoration: none;
  transition: $transition-fast;

  &:hover {
    opacity: 0.7;
  }

  .v-icon {
    vertical-align: baseline;

    &,
    .theme--light & {
      &,
      .application & {
        color: inherit;
      }
    }
  }

  .v-chip .v-chip__content {
    cursor: pointer;
  }
}

.v-icon {
  &.fas,
  &.far {
    transform: scale($mdi2faScaleFactor);
  }

  .subheading &,
  .heading &,
  .title &,
  .subtitle & .link--external & {
    font-size: inherit;
    transform: none;
  }

  .v-chip &,
  .v-avatar & {
    opacity: 0.8;
  }
}

code,
kbd {
  &:after,
  &:before {
    letter-spacing: -1em;
  }
}

code,
kbd {
  &:after {
    content: none;
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

  &.bash,
  &.language-bash {
    padding-left: 3em;

    &::before {
      content: "\F120";
      font-family: "Font Awesome 5 Free";
      transform: translateX(-2em) scale($mdi2faScaleFactor);
      display: inline-block;
      vertical-align: baseline;
    }
  }
}

.application .theme--dark.v-chip,
.theme--dark .v-chip {
  max-width: 250px;

  .v-chip__content {
    max-width: 100%;
  }
}

.home-button {
  cursor: pointer;

  img {
    background-color: $color-white;
  }
}

.v-toolbar {
  &.theme--dark a {
    color: $color-link--dark;
    text-decoration: none;
  }

  &__content {
    height: auto !important;
    padding: 0.5em;
  }

  &__title {
    margin-right: 2em;
  }

  &__title {
    display: flex;
    align-items: center;

    .label {
      margin-left: 0.5em;
    }

    .simple-svg {
      fill: $color-white;
    }
  }

  .v-input__icon--append .v-icon {
    opacity: 0;
    visibility: hidden;
  }

  .v-select.v-select--is-menu-active .v-input__icon--append {
    .v-icon {
      opacity: 1;
      visibility: visible;
      transform: scale($mdi2faScaleFactor) rotate(0);
    }
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

.v-select-list {
  .v-list__tile__content {
    max-width: 500px;
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
