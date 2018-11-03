<template>

<div :class="`CrafterAvatar grey--text text--${
      lightColors.indexOf(crafter.color) < 0 ? 'lighten' : 'darken'
    }-4 body-2`">
  <v-avatar
    :color="`${crafter.color} darken-2`"
    size="36"
  >{{crafter.initials}}</v-avatar>
</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Crafter from '../../types/Crafter';

@Component({
  name: 'CrafterAvatar',
})
export default class CrafterAvatar extends Vue {
  private lightColors: string[] = ['lime', 'amber', 'yellow', 'orange', 'shades'];

  @Prop() private crafter!: Crafter;

  constructor() {
    super();
  }
}
</script>

<style lang="scss">
.CrafterAvatar {
  display: inline-flex;

  .v-avatar {
    text-transform: uppercase;
  }
}
</style>
