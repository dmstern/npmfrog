<template>

<div class="packageDetail__installCode">
  <pre v-highlightjs="code"><code :class="`${language} language-${language} hljs`"></code></pre>
  <v-btn flat icon v-if="clipboard !== false"
    color="primary"
    v-clipboard:copy="code"
    v-clipboard:success="onCopy"
    v-clipboard:error="onError">
    <v-icon>fas fa-copy</v-icon>
  </v-btn>

  <v-snackbar
    v-model="showNotification"
    top
    right
    :color="notificationColor"
    auto-height
    :timeout="3000"
  >
    {{ notificationText }}
  </v-snackbar>
</div>

</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'CodeBlock',
})
export default class CodeBlock extends Vue {
  @Prop() private code!: string;
  @Prop() private clipboard: boolean | undefined;
  @Prop() private language: string | undefined;
  private showNotification: boolean = false;
  private notificationColor: string = '';
  private notificationText: string = '';

  constructor() {
    super();
  }

  private onCopy() {
    this.showNotification = true;
    this.notificationColor = 'success';
    this.notificationText = 'Copied code to clipboard.';
  }

  private onError() {
    this.showNotification = false;
    this.notificationColor = 'error';
    this.notificationText = 'Error: could not copy code to clipboard!';
  }

}

</script>

<style lang="scss" scoped>

.packageDetail__installCode {
  display: flex;

  pre {
    flex-grow: 1;
    align-self: flex-end;
    max-width: calc(100% - 52px);
  }
}

</style>
