<template>
  <div class="howto">
    <v-container>
      <h1>HowTo publish packages</h1>
      <h2>(For new packages) initialize an npm module</h2>
        <pre v-highlightjs><code class="bash">npm init</code></pre>
      <p>
        This will create a <code class="hljs">package.json</code> file for your new module. If you already have one, proceed with the next step.
      </p>
      <h2>Configure artifactory as an npm registry for your company</h2>
      <h3>Alternative 1) Globally</h3>
      <pre v-highlightjs v-if="data.artifactoryUrl"><code class="bash">npm set registry {{data.companyScope ? `@${data.companyScope}:` : ''}}{{data.artifactoryUrl}}</code></pre>
      <v-subheader>More info:</v-subheader>
      <v-list :class="`link-list`">
        <v-list-tile><ExternalLink href="https://docs.npmjs.com/cli/config"></ExternalLink></v-list-tile>
        <v-list-tile><ExternalLink href="https://docs.npmjs.com/misc/config#registry"></ExternalLink></v-list-tile>
      </v-list>
      <h3>Alternative 2) Only for your npm package</h3>
      <pre v-highlightjs v-if="data.artifactoryUrl"><code class="json">
      <span class="caption">package.json</span>
  ...
  "publishConfig": {
    "registry": "{{data.artifactoryUrl}}"
  }
  ...</code></pre>
      <v-subheader>More info:</v-subheader> 
      <v-list :class="`link-list`">
        <v-list-tile><ExternalLink href="https://docs.npmjs.com/files/package.json#publishconfig"></ExternalLink></v-list-tile>
      </v-list>
      <h2>Define files that should be included in your npm package</h2>
      <pre v-highlightjs><code class="json">
      <span class="caption">package.json (example)</span>
  "files": [
    "assets"
    "dist",
    "cli.js"
    "index.js"
  ]</code></pre>
      <h2>Commit everything</h2>
      <pre v-highlightjs><code class="bash">git commit</code></pre>
      <h2>Create a new version of your package</h2>
      <pre v-highlightjs><code class="bash">npm version [&lt;newversion&gt; | major | minor | patch ]

'npm [-v | --version]' to print npm version
'npm view &lt;pkg&gt; version' to view a package's published version
'npm ls' to inspect current package/dependency versions</code></pre>
      <v-subheader>More info:</v-subheader> 
      <v-list :class="`link-list`">
        <v-list-tile><ExternalLink href="https://docs.npmjs.com/cli/version"></ExternalLink></v-list-tile>
        <v-list-tile><ExternalLink text="semver.org" href="https://semver.org/"></ExternalLink></v-list-tile>
      </v-list>
      <h2>Publish package</h2>
      <pre v-highlightjs><code class="bash">npm publish</code></pre>
      <v-subheader>More info:</v-subheader> 
      <v-list :class="`link-list`">
        <v-list-tile><ExternalLink  href="https://docs.npmjs.com/cli/publish"></ExternalLink></v-list-tile>
      </v-list>
      <h2>Useful references</h2>
      <v-list :class="`link-list`">
        <v-list-tile><ExternalLink text="release-it" href="https://www.npmjs.com/package/release-it"></ExternalLink></v-list-tile>
        <v-list-tile><ExternalLink text="grunt-release" href="https://github.com/geddski/grunt-release"></ExternalLink></v-list-tile>
        <v-list-tile><ExternalLink text="How npm handles the 'scripts' field" href="https://docs.npmjs.com/misc/scripts#description"></ExternalLink></v-list-tile>
        <v-list-tile><ExternalLink text="semver.org" href="https://semver.org/"></ExternalLink></v-list-tile>
      </v-list>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataStore from '@/services/DataStore';
import ExternalLink from '../components/ExternalLink.vue';

@Component({
  components: {
    ExternalLink,
  },
})
export default class HowTo extends Vue {
  private data: {
    artifactoryUrl: string,
    companyScope: string,
  } = {
    artifactoryUrl: '',
    companyScope: '',
  };

  constructor() {
    super();
    DataStore.Instance.getConfig().then((response) => {
      console.log(response);
      if (response) {
        this.data.artifactoryUrl = `http${
          response.artifactory.https ? 's' : ''
        }://${
          response.artifactory.host
        }/artifactory/api/npm/${
          response.artifactory.repoKey
        }/`;
        this.data.companyScope = response.companyScope;
      }
    });
  }
}
</script>

<style lang="scss">

.v-list.link-list {
  background-color: transparent;
}


</style>
