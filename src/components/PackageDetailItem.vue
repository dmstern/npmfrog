<template>

<v-flex>
  <v-card>
    <v-card-title class="title">{{title}}</v-card-title>
    <v-card-text>
      <slot></slot>
    </v-card-text>
  </v-card>
</v-flex>

</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'PackageDetailItem'
})
export default class PackageDetailItem extends Vue {
  @Prop() private title!: string;

  constructor() {
    super();
  }
}

</script>

