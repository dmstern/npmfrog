<template>
  <a
    :href="href"
    target="_blank"
    :title="title"
  >
    <img :src="img" v-if="img">
    <v-icon v-else>{{icon || $vuetify.icons.arrowTopRight}}</v-icon>
    {{text || href}}
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
}
</script>

<style lang="scss" scoped>

.v-icon {
  font-size: inherit;
  line-height: inherit;
}

img {
  width: auto;
  height: 1em;
}

</style>
