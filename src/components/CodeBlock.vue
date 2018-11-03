<template>

<div :class="title? 'has-title' : ''">
  <v-toolbar
    v-if="title"
    dense
    card
    dark
    class="body-2"
  >
    {{title}}
  </v-toolbar>
  <div class="code-block">
    <pre v-highlightjs="code"><code :class="`${language} language-${language} hljs`"></code></pre>
    <div class="button-wrapper">
    <v-btn flat icon v-if="clipboard !== false"
      color="primary"
      v-clipboard:copy="code"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">
      <v-icon>{{$vuetify.icons.copy2Clipboard}}</v-icon>
    </v-btn>
    </div>

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
  @Prop() private title: string | undefined;
  private showNotification: boolean = false;
  private notificationColor: string = '';
  private notificationText: string = '';

  constructor() {
    super();
  }

  private onCopy(): void {
    this.showNotification = true;
    this.notificationColor = 'success';
    this.notificationText = 'Copied code to clipboard.';
  }

  private onError(): void {
    this.showNotification = false;
    this.notificationColor = 'error';
    this.notificationText = 'Error: could not copy code to clipboard!';
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/variables';

.code-block {
  display: flex;

  pre {
    flex-grow: 1;
    align-self: flex-end;
    max-width: calc(100% - 52px);
    min-height: 4em;
  }
}

.v-toolbar {
  background: $color-code-bg;
  border-bottom: 1px solid lighten($color-code-bg, 5%);
}

.has-title {
  .button-wrapper {
    width: 0;

    .v-btn {
      transform: translate(-120%, -115%);
    }
  }

  code {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  pre {
    width: 100%;
    max-width: initial;
  }
}
</style>
