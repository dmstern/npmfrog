<template>
  <a
    :href="href"
    :target="newTab === false ? '' : '_blank'"
    :title="title"
    :class="text === false ? 'icon-only' : ''"
  >
    <img :src="img" v-if="img">
    <v-icon v-else>{{icon || $vuetify.icons.externalLink}}</v-icon>
    <span class="label" v-if="text !== false">{{text || href}}</span>
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ExternalLink',
})
export default class ExternalLink extends Vue {
  @Prop() private title?: string;
  @Prop() private href!: string;
  @Prop() private text?: string;
  @Prop() private icon?: string;
  @Prop() private img?: string;
  @Prop() private newTab?: boolean;
}
</script>

<style lang="scss" scoped>
.v-icon {
  font-size: inherit;
  line-height: inherit;
  display: inline;
  margin-right: 4px;

  .icon-only & {
    margin-right: 0;
  }
}

.label {
  display: inline;
}

img {
  width: auto;
  height: 1em;
}
</style>
