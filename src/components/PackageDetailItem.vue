<template>

<v-flex>
  <v-card class="PackageDetailItem">
    <v-card-title class="subheading">
      <v-icon v-if="icon">{{icon}}</v-icon>
      {{title.toLowerCase()}}
    </v-card-title>
    <v-card-text :class="bigContent !== false ? `title` : ''"><slot></slot></v-card-text>
  </v-card>
</v-flex>

</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'PackageDetailItem',
})
export default class PackageDetailItem extends Vue {
  @Prop() private title!: string;
  @Prop() private bigContent?: boolean;
  @Prop() private icon!: string;

  constructor() {
    super();
  }
}

</script>

<style lang="scss">
@import "../assets/variables";

.PackageDetailItem {
  .v-card__text {
    padding-top: 0;
  }

  .subheading {
    font-weight: bold;

    .v-icon {
      margin-right: 0.5em;
    }
  }

  a {
    margin-right: 1em;
  }
}
</style>

