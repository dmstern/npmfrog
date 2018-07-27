<template>

<div class="page-container">
  <md-app id="app" md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
        </div>
      <!-- <span class="md-title">npmFrog - Explore jFrog's Artifactory - the NPM-way</span> -->
        <md-autocomplete
          class="search"
          v-model="selectedPackage"
          :md-options="Object.keys(packages)"
          md-layout="box">
          <label>Search packages</label>
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

.page-container {
  height: 100vh;
}

#app {
  // font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
}

</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PackageService from '@/services/PackageService';
import { PackageMetaData } from '@/api/package-meta-data';
import { PackagesResponse } from '@/api/PackageResponse';
import PackagesService from '@/services/PackageService';

@Component
export default class App extends Vue {
  @Prop() private menuVisibleProp!: boolean;
  @Prop() private packagesProp!: PackagesResponse;
  @Prop() private selectedPackageProp!: string|null;
  private menuVisible: boolean;
  private packages: PackagesResponse;
  private selectedPackage: string|null;

  constructor() {
    super();
    this.menuVisible = false;
    this.packages = {};
    this.selectedPackage = null;
    this.loadPackages();
  }

  private loadPackages(): void {
    PackagesService.getPackages().then((response) => {
      this.packages = response;
    });
  }
}
</script>
