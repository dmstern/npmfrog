<template>
  <a
    :href="href"
    target="_blank"
    :title="title"
  >
    <v-icon>{{$vuetify.icons.arrowTopRight}}</v-icon>
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
}
</script>

<style lang="scss" scoped>

.v-icon {
  font-size: inherit;
  line-height: inherit;
}

</style>
