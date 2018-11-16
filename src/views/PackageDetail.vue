<template>
<div>
  <v-container v-if="!data.packageDetail">
    <LoadingSpinner msg="Loading package details..."/>
  </v-container>
  <v-container v-else fluid grid-list-lg :class="isOld() ? 'isOld' : ''">
    <v-layout row wrap>
      <v-flex xs12 md7 xl8 class="packageDetail__heading">
        <v-alert
          v-if="isOld()"
          v-model="showAlert"
          dismissible
          type="info"
        >
          You are displaying an old version of this package. To see the newest version, click on "latest" under "versions".
        </v-alert>
        <h1>{{ data.packageDetail.name }}</h1>
        <div class="subheading last-published-version-line">
          <span>{{data.currentPackage.version}}</span>
          <span>Published <timeago :datetime="data.packageDetail.time[data.currentPackage.version]"></timeago></span>
        </div>
      </v-flex>
      <v-flex xs12 md5 xl4>
        <blockquote
          v-if="data.currentPackage.description"
          class="blockquote blockquote--beautify"
        >{{data.currentPackage.description}}</blockquote>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md7 xl8 order-xs2 order-md1>
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab>README</v-tab>
            <v-tab>Code</v-tab>
            <v-tab>{{data.currentPackage.dependenciesCount}} Dependencies</v-tab>
            <v-tab>{{Object.keys(data.packageDetail.versions).length}} Versions</v-tab>
            <v-tab-item class="readme">
              <v-card-text>
                <div v-highlightjs v-if="data.packageDetail.readme" :key="data.packageDetail.readme" v-html="data.packageDetail.readme"></div>
                <div v-else>
                  <v-alert :value="true" type="warning">
                    No README.md file found.
                  </v-alert>
                </div>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text v-if="data.packageDetail.mainCode || data.currentPackage.scripts">
                <div v-if="data.currentPackage.scripts">
                  <h2>Scripts</h2>

                  <table class="package-detail__scripts">
                    <thead>
                      <tr>
                        <th>Command</th>
                        <th>executes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(script, key) in data.currentPackage.scripts" :key="key">
                        <td>
                          <CodeBlock :code="['start', 'test', 'version'].some(task => task === key) ? `npm ${key}` : `npm run ${key}`" language="bash"></CodeBlock>
                        </td>
                        <td><pre v-highlightjs="script"><code class="bash"></code></pre></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="data.packageDetail.fileList">
                  <h2>Files</h2>
                  <div
                     @click="selectCode"
                  >
                    <v-treeview
                      :active.sync="data.activeFile"
                      v-model="data.tree"
                      :open="data.open"
                      :items="data.packageDetail.fileList"
                      activatable
                      item-key="id"
                      open-on-click
                      transition
                    >
                      <template slot="prepend" slot-scope="{ item, open, leaf }">
                        <v-icon v-if="item.children">
                          {{ open ? $vuetify.icons.folderOpen : $vuetify.icons.folder }}
                        </v-icon>
                        <v-icon v-else>
                          {{ getFileIcon(item.name) }}
                        </v-icon>
                      </template>
                      <template slot="append" slot-scope="{ item }" v-if="item.size !== undefined">
                        <v-list-tile-action>
                          {{ fileSize(item.size) }}
                        </v-list-tile-action>
                      </template>
                    </v-treeview>
                  </div>
                  <v-alert
                    v-if="data.activeTreeItem && data.activeTreeItem.size"
                    :value="(data.activeTreeItem.size > maxSizeToShowContent) || !isHighlightableType(data.activeTreeItem)"
                    type="warning"
                  >
                    <h3>
                      <span
                        v-if="data.activeTreeItem.size > maxSizeToShowContent"
                      >
                        This file is too big to show it's content (> {{maxSizeToShowContent / 1000}} kB).
                      </span>
                      <span v-if="!isHighlightableType(data.activeTreeItem)">This filetype ({{`${data.activeTreeItem.type}`}}) is not supported.</span>
                    </h3>
                    But you can download it here: <ExternalLink :href="`${baseUrl}/packageDetail/${
                      data.currentPackage ? data.currentPackage.scope : undefined
                      }/${$router.currentRoute.params.packageName}/${
                        data.currentPackage ? data.currentPackage.version : undefined
                      }/files/${encodeURIComponent(`${data.activeTreeItem.path}/${data.activeTreeItem.name}`)}?format=file`"></ExternalLink>
                  </v-alert>
                  <LoadingSpinner
                    class="transition"
                    :class="isLoadingCode? 'visible' : 'hidden'"
                  ></LoadingSpinner>
                  <CodeBlock
                    :code="data.activeCode"
                    :title="data.activeTreeItem.name"
                    class="file-content transition"
                    :class="(data.activeTreeItem.name && !isLoadingCode)? 'visible' : 'hidden'"
                    :key="data.activeTreeItem.id"
                    :language="getLanguage(data.activeTreeItem.name)"
                    v-if="data.activeCode !== undefined && isHighlightableType(data.activeTreeItem)"
                  ></CodeBlock>
                </div>
              </v-card-text>
              <v-card-text v-else>
                <v-alert :value="true" type="info">
                  Nothing to show...
                </v-alert>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text v-if="data.currentPackage.dependenciesCount">
                <h2>Dependencies</h2>
                <router-link
                  v-for="(version, key) in data.currentPackage.dependencies"
                  :key="key"
                  :to="`/package/${key}`">
                  <v-chip
                    small
                    outline
                    color="primary"
                  >
                    {{key}}
                  </v-chip>
                </router-link>
                <h2>DevDependencies</h2>
                <router-link
                  v-for="(version, key) in data.currentPackage.devDependencies"
                  :key="key"
                  :to="`/package/${key}`">
                  <v-chip
                    small
                    outline
                    color="primary"
                  >
                    {{key}}
                  </v-chip>
                </router-link>
              </v-card-text>
              <v-card-text v-else>
                <v-alert :value="true" type="info">
                  This package has no dependencies.
                </v-alert>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <h2>Current Tags</h2>
                <v-list>
                  <v-list-tile
                    v-for="(version, tag) in data.currentTags"
                    :key="tag"
                    @click="setVersion(version)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-text="version"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-title v-text="tag"></v-list-tile-title>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <h2>Version History</h2>
                <v-list>
                  <v-list-tile
                    v-for="version in Object.keys(data.versionsHistory).sort((a, b) => data.packageDetail.time[a] < data.packageDetail.time[b] ? 1 : -1)"
                    :key="version"
                    @click="setVersion(version)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-text="version"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-title>
                        <timeago :datetime="data.packageDetail.time[version]"></timeago>
                      </v-list-tile-title>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
      <v-flex xs12 md5 xl4 order-xs1 order-md2 class="meta-panel">
        <v-layout row wrap>
          <PackageDetailItem title="install" :bigContent="false" v-if="data.config && data.config.artifactory" :icon="$vuetify.icons.install" :full="true">
            <CodeBlock :code="getInstallCode().config" language="bash"></CodeBlock>
            <CodeBlock :code="getInstallCode().install" language="bash"></CodeBlock>
            <v-btn
              color="success"
              class="v-btn--standalone"
              :href="data.versionsHistory[data.currentPackage.version].dist.tarball"
            >
              <v-icon left dark>{{$vuetify.icons.download}}</v-icon>
              <span>Direct Download</span>
            </v-btn>
          </PackageDetailItem>
          <PackageDetailItem title="Version" :icon="$vuetify.icons.version">
            <span>{{data.currentPackage.version}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="License" v-if="data.currentPackage.license" :icon="$vuetify.icons.legal">
            <span>{{data.currentPackage.license}}</span>
          </PackageDetailItem>
          <PackageDetailItem title="Website" v-if="data.currentPackage.homepage" :icon="$vuetify.icons.homepage">
            <a :href="`${data.currentPackage.homepage}`" target="_blank" class="link--external">
              <v-icon>{{$vuetify.icons.externalLink}}</v-icon>
              {{data.currentPackage.homepage}}
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Repository" v-if="data.currentPackage.repository" :icon="$vuetify.icons.code">
            <a :href="`${data.currentPackage.repositoryUrl }`" target="_blank">
              <v-icon v-if="data.currentPackage.repositoryName in $vuetify.icons">{{$vuetify.icons[data.currentPackage.repositoryName]}}</v-icon>
              {{data.currentPackage.repositoryName}}
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Feedback" v-if="data.currentPackage.bugs" :icon="$vuetify.icons.contact">
            <a :href="`${data.currentPackage.bugTrackerUrl }`" target="_blank" title="go to / report issues">
              <v-icon>{{$vuetify.icons.bug}}</v-icon>
            </a>
            <a :href="`mailto:${data.currentPackage.bugs.email }`" v-if="data.currentPackage.bugs.email" target="_blank" title="write email">
              <v-icon>{{$vuetify.icons.mail}}</v-icon>
            </a>
          </PackageDetailItem>
          <PackageDetailItem title="Created" :icon="$vuetify.icons.created">
            <timeago :datetime="data.packageDetail.time.created"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Last publish" :icon="$vuetify.icons.updated">
            <timeago :datetime="data.packageDetail.time[data.currentPackage.version]"></timeago>
          </PackageDetailItem>
          <PackageDetailItem title="Crafted by" v-if="data.currentPackage.author" :icon="$vuetify.icons.author" :bigContent="false">
            <v-menu
              open-on-hover
              auto
              v-for="(crafter, index) in data.currentPackage.crafters"
              :key="index"
              top
              offset-y
            >
              <CrafterAvatar
                :crafter="crafter"
                slot="activator"
              ></CrafterAvatar>
              <v-card>
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                       <CrafterAvatar :crafter="crafter"></CrafterAvatar>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{crafter.name}}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="crafter.url"><ExternalLink :href="crafter.url" :icon="$vuetify.icons.website"></ExternalLink></v-list-tile-sub-title>
                    </v-list-tile-content>

                  </v-list-tile>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-tile v-if="inSearchableList(crafter)" @click="triggerSearchFilter(crafter)">
                    <v-list-tile-action>
                      <v-icon>{{$vuetify.icons.arrowTopLeft}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Search for packages by this crafter</v-list-tile-title>
                  </v-list-tile>

                  <a :href="`mailto:${crafter.email}`" target="_blank">
                    <v-list-tile v-if="crafter.email">
                      <v-list-tile-action>
                        <v-icon>{{$vuetify.icons.email}}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>mailto:{{crafter.email}}</v-list-tile-title>
                    </v-list-tile>
                  </a>
                </v-list>
              </v-card>
            </v-menu>
          </PackageDetailItem>
          <PackageDetailItem title="Keywords" :bigContent="false" v-if="data.currentPackage.tags" :icon="$vuetify.icons.tags">
            <div
              v-for="(tag, index) in data.currentPackage.tags"
              :key="index"
              style="display: inline"
            >
              <a
                href="#"
                v-if="inSearchableList(tag)"
                title="Search for packages with this keyword"
              >
                <v-chip @click="triggerSearchFilter(tag)">
                  {{tag.value}}
                  <v-icon right>{{$vuetify.icons.arrowTopLeft}}</v-icon>
                </v-chip>
               </a>
               <v-chip v-else>{{tag.value}}</v-chip>
            </div>
          </PackageDetailItem>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Package from '../../types/Package';
import DataStore from '@/services/DataStore';
import Router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { PackageMetaDataDTO, IVersions } from '../../types/package-meta-data';
import Config from '../../types/Config';
import PackageDetailItem from '@/components/PackageDetailItem.vue';
import CodeBlock from '@/components/CodeBlock.vue';
import CrafterAvatar from '@/components/CrafterAvatar.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import { EventBus, Events, Errors } from '@/services/event-bus';
import { setTimeout, clearTimeout } from 'timers';
import Searchable from '../../types/Searchable';
import { icons } from '../plugins/vuetify';
import { close } from 'fs';
import TreeItem from '../../types/TreeItem';
import Util from '../util/Util';
import BackendApi from '../services/BackendApi';

@Component({
  components: {
    LoadingSpinner,
    PackageDetailItem,
    CodeBlock,
    CrafterAvatar,
    ExternalLink,
  },
})
export default class PackageDetail extends Vue {
  @Prop()
  private dataProp!: {
    packageDetail: Package | null;
    currentPackage?: Package;
    currentTags: IVersions;
    versionsHistory: IVersions;
    config: Config | undefined;
    tree: any[];
    open: any[];
    activeFile: any[];
    activeCode?: string;
    activeTreeItem: TreeItem;
  };
  private data: {
    packageDetail: Package | null;
    currentPackage?: Package;
    currentTags: IVersions;
    versionsHistory: IVersions;
    config: Config | undefined;
    tree: any[];
    open: any[];
    activeFile: any[];
    activeTreeItem?: TreeItem;
    activeCode?: string;
  } = this.dataProp;
  private activeTab: number;
  private isLoadingCode: boolean;
  private showAlert: boolean = false;

  constructor() {
    super();
    this.activeTab = 0;
    this.data = {
      packageDetail: null,
      currentPackage: undefined,
      currentTags: {},
      versionsHistory: {},
      config: undefined,
      tree: [],
      open: ['public'],
      activeFile: [],
      activeCode: '',
      activeTreeItem: {
        id: '',
        name: '',
        path: '',
      },
    };
    this.isLoadingCode = false;
    Router.afterEach(route => {
      if (route.name === 'packageDetail') {
        this.resetModel();
        this.init();
      }
    });
    this.init();
  }

  private get baseUrl(): string {
    return BackendApi.Instance.getBaseURL();
  }

  private resetModel(): void {
    this.activeTab = 0;
    this.resetCurrentPackage();
    this.data.config = undefined;
    this.data.currentTags = {};
    this.data.versionsHistory = {};
    this.resetActiveCode();
  }

  private resetCurrentPackage(): void {
    this.data.currentPackage = undefined;
    this.data.packageDetail = null;
  }

  private init(): void {
    Promise.all([this.getPackageDetails(), this.loadConfig()]);
  }

  private setVersion(version: string): void {
    this.resetCurrentPackage();
    this.resetActiveCode();
    Promise.resolve(this.getPackageDetails(version));
  }

  private loadConfig(): Promise<Config | undefined> {
    return DataStore.Instance.getConfig().then(config => {
      return (this.data.config = config);
    });
  }

  private get maxSizeToShowContent(): number {
    return 50000;
  }

  private selectCode(event: Event): void {
    const target = event.target as HTMLElement;
    const label = target.classList.contains('v-icon')
      ? (target.nextSibling as HTMLElement)
      : target;
    const clickedLabel = label.innerHTML;

    if (!this.data.activeFile.length) {
      this.resetActiveCode();
      return;
    }

    const id = this.data.activeFile[0];

    if (this.data.packageDetail && this.data.packageDetail.fileList) {
      const currentFile = this.findFile(this.data.packageDetail.fileList, id);
      if (currentFile && !currentFile.children && currentFile.name === clickedLabel) {
        if (currentFile.size !== undefined && currentFile.size > this.maxSizeToShowContent) {
          this.data.activeTreeItem = currentFile;
          this.data.activeCode = undefined;
        } else {
          this.toggleLoading(true);
          const timeout = global.setTimeout(() => {
            if (!this.data.activeCode) {
              this.toggleLoading(false);
              EventBus.$emit(Errors.TIMEOUT_ERROR, new Error('Timeout Error. No code found.'));
            }
          }, 30000);
          const code = DataStore.Instance.getFileContent(
            {
              scope: this.data.currentPackage ? this.data.currentPackage.scope : undefined,
              packageName: Router.currentRoute.params.packageName,
              version: this.data.currentPackage ? this.data.currentPackage.version : undefined,
            },
            encodeURIComponent(`${currentFile.path}/${currentFile.name}`),
          )
            .then(content => {
              if (typeof content === 'string') {
                this.data.activeCode = content;
              } else {
                try {
                  this.data.activeCode = JSON.stringify(content, null, 2);
                } catch (error) {
                  this.data.activeCode = 'Error: Could not display file content.';
                }
              }
              this.data.activeTreeItem = currentFile;
              this.toggleLoading(false);
              global.clearTimeout(timeout);
            })
            .catch(error => {
              this.toggleLoading(false);
              EventBus.$emit(Errors.SERVER_ERROR, error);
              global.clearTimeout(timeout);
            });
        }
      }
    }
  }

  private isHighlightableType(item: TreeItem): boolean {
    return (
      item.type === null ||
      (item.type !== undefined &&
        (item.type.endsWith('json') ||
          item.type.endsWith('application/javascript') ||
          item.type.startsWith('text')))
    );
  }

  private resetActiveCode(): void {
    this.data.activeTreeItem = {
      id: '',
      path: '',
      name: '',
    };
    this.data.activeCode = undefined;
  }

  private toggleLoading(on: boolean): void {
    this.isLoadingCode = on;
    if (on) {
      this.resetActiveCode();
    }
  }

  private findFile(treeItems: TreeItem[], id: string): TreeItem | undefined {
    for (const item of treeItems) {
      if (item.id === id) {
        return item;
      } else if (item.children) {
        const file = this.findFile(item.children, id);
        if (file) {
          return file;
        }
      }
    }
  }

  private getPackageDetails(
    version?: string,
  ): Promise<{
    packageDetail: Package;
    currentPackage?: Package;
  }> {
    return DataStore.Instance.getPackageDetail({
      scope: Router.currentRoute.params.scope,
      packageName: Router.currentRoute.params.packageName,
      version,
    }).then(response => {
      this.data.packageDetail = response.packageDetail;
      this.data.currentTags = response.packageDetail['dist-tags'];
      this.data.versionsHistory = response.packageDetail.versions;
      this.data.currentPackage = response.currentPackage;
      return {
        packageDetail: response.packageDetail,
        currentPackage: response.currentPackage,
      };
    });
  }

  private getInstallCode():
    | {
        config: string;
        install: string;
      }
    | undefined {
    if (this.data.packageDetail && this.data.config && this.data.config.artifactory) {
      return {
        config: `npm config set ${
          this.data.packageDetail.scope ? this.data.packageDetail.scope + ':' : ''
        }registry http://${this.data.config.artifactory.host}/artifactory/api/npm/${
          this.data.config.artifactory.repoKey
        }/`,
        install: `npm i ${this.data.packageDetail.name}`,
      };
    }
  }

  private inSearchableList(searchableItem: Searchable): boolean {
    return DataStore.Instance.searchItems.some(searchable => searchable === searchableItem);
  }

  private triggerSearchFilter(searchable: Searchable): void {
    Router.push(`/`);
    this.$nextTick(() => {
      EventBus.$emit(Events.TRIGGER_FILTER_SEARCH, { filters: [searchable] });
    });
  }

  private getFileIcon(filename: string): string {
    if (filename.toLowerCase().includes('readme')) {
      return icons.info;
    }

    if (filename.toLowerCase().includes('license')) {
      return icons.license;
    }

    if (filename.toLowerCase().includes('webpack')) {
      return icons.webpack;
    }

    if (filename.toLowerCase().includes('gulp')) {
      return icons.gulp;
    }

    if (filename.toLowerCase().includes('lint')) {
      return icons.fingerUp;
    }

    if (filename.toLowerCase().includes('grunt')) {
      return icons.grunt;
    }

    if (filename.toLowerCase() === 'package.json') {
      return icons.packageJson;
    }

    if (filename.toLowerCase().startsWith('.npm')) {
      return icons.npm;
    }

    if (filename.toLowerCase().startsWith('.git')) {
      return icons.git;
    }

    if (filename.toLowerCase().startsWith('.babel')) {
      return icons.babel;
    }

    const parts: string[] = filename.split('.');
    const extension: string = parts.length ? parts[parts.length - 1] : '';
    const extensionIcon = icons[extension];
    if (extensionIcon) {
      return extensionIcon;
    }

    if (filename.toLowerCase().includes('config')) {
      return icons.configFile;
    }

    return icons.file;
  }

  private getLanguage(filename: string): string {
    const languages = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      md: 'markdown',
      css: 'css',
      html: 'html',
      htm: 'html',
      scss: 'scss',
      hbs: 'handlebars',
      xml: 'xml',
      json: 'json',
      svg: 'svg',
      ftl: 'xml',
      sh: 'bash',
      yml: 'yaml',
      yaml: 'yaml',
    };
    const parts = filename.split('.');
    if (parts.length > 0) {
      const extension = parts[parts.length - 1];
      if (languages[extension]) {
        return languages[extension];
      }
    }
    return 'plaintext';
  }

  private fileSize(bytes: number): string {
    return Util.fileSize(bytes);
  }

  private isOld(): boolean | undefined {
    if (!this.data.packageDetail || !this.data.currentPackage) {
      return false;
    }
    const isOld =
      typeof this.data.packageDetail.distTags.latest === 'string' &&
      this.data.currentPackage.version !== undefined &&
      this.data.currentPackage.version < this.data.packageDetail.distTags.latest;
    this.showAlert = isOld;
    return isOld;
  }
}
</script>

<style lang="scss">
@import '../assets/variables';

.v-treeview-node {
  &:not(.v-treeview-node--leaf) > .v-treeview-node__root > .v-treeview-node__content {
    margin-left: 8px;
  }

  .v-treeview-node__content {
    .v-icon {
      width: 30px;
    }
  }

  .v-icon.fas,
  .v-icon.far {
    &.v-treeview-node__toggle {
      transform: rotate(-0.25turn) scale($mdi2faScaleFactor);

      &--open {
        transform: rotate(0) scale($mdi2faScaleFactor);
      }
    }
  }
}

.v-btn--standalone {
  .v-card & {
    margin-left: 0;
  }
}

.transition {
  transition: $transition-smooth;
}

.visible {
  visibility: visible;
  opacity: 1;
  height: auto;
}

.hidden {
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-treeview {
  margin-bottom: 2rem;
}

pre code.hljs {
  margin-bottom: 1em;
}

.isOld {
  background: url(../assets/img/paper.jpg);
  opacity: 0.9;

  .v-card,
  .v-tabs__bar,
  .v-list {
    background: rgba(255, 255, 255, 0.5);

    .v-list {
      background-color: transparent;
    }
  }
}

.version-list {
  list-style: none;

  li {
    display: flex;
    width: 100%;
  }
}

.last-published-version-line {
  font-family: $monospace;

  > span:not(:last-child) {
    &::after {
      content: '•';
      display: inline-block;
      margin: 0 0.7em;
    }
  }
}

.blockquote--beautify {
  position: relative;

  &::before,
  &::after {
    position: absolute;
    color: $color-gray-extralight;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 10em;
    opacity: 0.3;
  }

  &::before {
    content: '„';
    bottom: -60px;
    left: 0;
  }

  &::after {
    content: '“';
    top: -51px;
    transform: translateX(-1rem);
  }
}
</style>
