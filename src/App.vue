<template>

<div class="page-container">
  <md-app id="app" md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-white">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
        </div>
        <md-autocomplete
          class="search"
          v-model="selectedPackage"
          :md-options="searchItems"
          md-layout="box">
          <label><md-icon>search</md-icon> Search packages...</label>

          <template slot="md-autocomplete-item" slot-scope="{ item, term }" class="search-item">
            <span v-if="item.key === 'name'">
              <md-badge :class="item.key" class="md-square search-key" v-bind:md-content="item.key" />
              <strong class="search-item-text" :class="item.key" :md-term="term">{{ item.displayString }}</strong>
            </span>
            <span v-else class="search-item--with-key">
              <md-badge :class="item.key" class="md-square search-key" v-bind:md-content="item.key" />
              <md-highlight-text class="search-item-text" :class="item.key" :md-term="term">{{ item.displayString }}</md-highlight-text>
            </span>
          </template>

          <template slot="md-autocomplete-empty" slot-scope="{ term }">
            No packages matching "{{ term }}" were found.
          </template>

        </md-autocomplete>
        <div class="md-toolbar-section-end">
        </div>
      </div>
    </md-app-toolbar>

    <md-app-drawer  :md-active.sync="menuVisible">
      <md-toolbar class="md-transparent" md-elevation="0">
        Navigation
      </md-toolbar>
      <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
    </md-app-drawer>

    <md-app-content>
      <router-view/>
    </md-app-content>
  </md-app>
</div>

</template>

<style lang="scss">
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Fira+Mono|Material+Icons");
@import "assets/variables";
@import "~vue-material/dist/theme/engine";

@include md-register-theme(
  "default",
  (primary: md-get-palette-color(blue, A200), accent: #d63e19, neutral: white)
);

@import "~vue-material/dist/theme/all"; // Apply the theme

.page-container {
  height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;

  .md-toolbar {
    border-bottom: 1px solid $color-gray-extralight;

    @include md-theme-component() {
      &.md-white {
        @include md-theme-property(background-color, neutral);
        @include md-theme-property(color, text-primary, neutral);
        @include md-toolbar-icon(text-accent, neutral);
        @include md-toolbar-button(text-primary, neutral);
        @include md-toolbar-title(text-primary, neutral);
      }
    }

    &.md-white {
      background-color: white;
    }
  }
}

.md-toolbar .md-autocomplete.md-theme-default.md-autocomplete-box {
  label,
  input {
    @include md-theme-property(color, text-hint, neutral);
    @include md-theme-property(-webkit-text-fill-color, text-hint, neutral);
  }

  &.md-focused {
    label,
    input {
      @include md-theme-property(color, text-accent, neutral);
      @include md-theme-property(-webkit-text-fill-color, text-accent, neutral);
    }
  }
}

.md-badge.md-square.md-theme-default.search-key {
  background-color: $color-gray-light;
  display: inline-block;
  padding: 0.3em;
  margin-right: 0.3em;
  min-height: 1rem;

  &::after {
    content: ":";
  }

  &.author {
    background-color: $color-search-author;
  }

  &.keyword {
    background-color: $color-search-keyword;
  }
}

.search-item--with-key {
  display: flex;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackagesService from '@/services/PackageService';
import Package from '@/model/Package';
import { SearchItem } from '@/model/SearchItem';

@Component
export default class App extends Vue {
  @Prop() private menuVisibleProp!: boolean;
  @Prop() private selectedPackageProp!: string|null;
  private menuVisible: boolean;
  private selectedPackage: string|null;
  private searchItems: Array<string|{}>;

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
