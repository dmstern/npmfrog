<template>
  <div class="howto">
    <v-container>
      <div v-if="data.additional.markup && data.showDefault">
        <h1>Contents</h1>
        <v-list :class="`link-list`">
          <v-list-tile><a href="#default">How To publish packages</a></v-list-tile>
          <v-list-tile><a href="#additional">{{data.additional.heading || 'More Info'}}</a></v-list-tile>
        </v-list>
      </div>
      <v-divider v-if="data.additional.markup && data.showDefault"></v-divider>
      <section id="default" v-if="data.showDefault">
        <h1>How To publish packages</h1>
        <h2>(For new packages) initialize an npm module</h2>
          <CodeBlock code="npm init" language="bash"></CodeBlock>
        <p>
          This will create a <code class="hljs">package.json</code> file for your new module. If you already have one, proceed with the next step.
        </p>
        <h2>Configure artifactory as an npm registry for your company</h2>
        <h3>Alternative 1) Globally (for the current os user)</h3>
        <CodeBlock :code="`npm set ${data.companyScope ? `@${data.companyScope}:` : ''}registry ${data.artifactoryUrl}`" language="bash"></CodeBlock>
        <v-subheader>More info:</v-subheader>
        <v-list :class="`link-list`">
          <v-list-tile><ExternalLink href="https://docs.npmjs.com/cli/config"></ExternalLink></v-list-tile>
          <v-list-tile><ExternalLink href="https://docs.npmjs.com/misc/config#registry"></ExternalLink></v-list-tile>
        </v-list>
        <h3>Alternative 2) Only for your npm package</h3>
        <CodeBlock
          :key="data.artifactoryUrl"
          v-if="data.artifactoryUrl"
          title="package.json"
          language="json"
          :code="data.codes[0](data.artifactoryUrl)"
        ></CodeBlock>
        <v-subheader>More info:</v-subheader> 
        <v-list :class="`link-list`">
          <v-list-tile><ExternalLink href="https://docs.npmjs.com/files/package.json#publishconfig"></ExternalLink></v-list-tile>
        </v-list>
        <h2>Login to Artifactory</h2>
        <CodeBlock :code="`npm login --registry=${data.artifactoryUrl}`" language="bash"></CodeBlock>
        <p>You'll get prompted to enter your username and password of your in-house <a :href="data.artifactoryUrl" target="_blank">artifactory instance</a>.</p>
        <v-subheader>More info:</v-subheader>
        <v-list :class="`link-list`">
          <v-list-tile><ExternalLink href="https://docs.npmjs.com/cli/adduser"></ExternalLink></v-list-tile>
        </v-list>
        <h2>Define files that should be included in your npm package</h2>
        <CodeBlock :title="`package.json (example)`" :code="data.codes[1]()" :language="`json`"></CodeBlock>
        <h2>Commit everything</h2>
        <CodeBlock :code="data.codes[2]()" language="bash"></CodeBlock>
        <h2>Create a new version of your package</h2>
        <pre v-highlightjs><code class="bash">npm version [&lt;newversion&gt; | major | minor | patch ] [-m "VERSION_MESSAGE"]

  'npm [-v | --version]' to print npm version
  'npm view &lt;pkg&gt; version' to view a package's published version
  'npm ls' to inspect current package/dependency versions</code></pre>
        <v-subheader>Example:</v-subheader>
        <CodeBlock code='npm version minor -m "CR 534 new features"' language="bash"></CodeBlock>
        <v-subheader>More info:</v-subheader> 
        <v-list :class="`link-list`">
          <v-list-tile><ExternalLink href="https://docs.npmjs.com/cli/version"></ExternalLink></v-list-tile>
          <v-list-tile><ExternalLink text="semver.org" href="https://semver.org/"></ExternalLink></v-list-tile>
        </v-list>
        <h2>Publish package</h2>
        <CodeBlock code="npm publish" language="bash"></CodeBlock>
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
      </section>
      <v-divider v-if="data.additional.markup && data.showDefault"></v-divider>
      <section id="additional" v-if="data.additional.markup" v-html="data.additional.markup">
      </section>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataStore from '../services/DataStore';
import ExternalLink from '../components/ExternalLink.vue';
import CodeBlock from '../components/CodeBlock.vue';

@Component({
  components: {
    ExternalLink,
    CodeBlock,
  },
})
export default class HowTo extends Vue {
  private data: {
    showDefault?: boolean;
    artifactoryUrl: string;
    companyScope: string;
    additional?: {
      markup: string;
      heading: string;
    };
    codes: any[];
    additionalHeading?: string;
  } = {
    showDefault: false,
    artifactoryUrl: '',
    companyScope: '',
    codes: [],
    additional: {
      markup: '',
      heading: '',
    },
  };

  constructor() {
    super();
    DataStore.Instance.getConfig().then(response => {
      if (response) {
        this.data.artifactoryUrl = `http${response.artifactory.https ? 's' : ''}://${
          response.artifactory.host
        }/artifactory/api/npm/${response.artifactory.repoKey}/`;
        this.data.companyScope = response.companyScope;
        if (response.howto) {
          this.data.showDefault = response.howto.default === true;
          this.data.additional = response.howto.additional;
        }
      }
    });
    this.data.codes.push(
      url => {
        return `...
  "publishConfig": {
    "registry": "${url}"
  }
  ...`;
      },
      () => {
        return `"files": [
    "assets"
    "dist",
    "cli.js"
    "index.js"
  ]`;
      },
      () => {
        return `git commit -am "<some descriptive message>"`;
      },
    );
  }
}
</script>

<style lang="scss">
.v-list.link-list {
  background-color: transparent;
}

section h1 {
  font-size: 2em;
}
</style>
