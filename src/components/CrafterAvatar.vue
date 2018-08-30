<template>

<div class="CrafterAvatar">
  <v-avatar
    :title="crafter.name"
    :color="`${color} darken-2`"
    size="32"
    :class="`grey--text text--${
      lightColors.indexOf(color) < 0 ? 'lighten' : 'darken'
    }-4 body-2`"
  >{{crafter.initials}}</v-avatar>
</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Crafter from '@/model/Crafter';
import colors from 'vuetify/es5/util/colors';

@Component({
  name: 'CrafterAvatar',
})
export default class CrafterAvatar extends Vue {
  private static colors: Map<string, number> = new Map<string, number>();
  private color: string;
  private lightColors: string[] = [
    'lime',
    'amber',
    'yellow',
    'orange',
    'shades',
  ];

  @Prop() private crafter!: Crafter;

  constructor() {
    super();
    this.color = this.getColor();
  }

  private getColor(): string {
    const initials = this.crafter.initials;
    const key = this.crafter.email
      ? this.crafter.email.replace(/ /g, '')
      : this.crafter.name
        ? this.crafter.name.replace(/ /g, '')
        : '';
    if (key && CrafterAvatar.colors[key]) {
      return CrafterAvatar.colors[key];
    }

    if (initials) {
      let colorKeyNumber =
        (initials.charCodeAt(0) + initials.charCodeAt(0)) % (Object.keys(colors).length - 2);
      CrafterAvatar.colors.forEach((oldKey) => {
        if (oldKey === colorKeyNumber) {
          colorKeyNumber++;
          if (colorKeyNumber >= Object.keys(colors).length - 2) {
            colorKeyNumber -= 2;
          }
        }
      });
      const colorKey = Object.keys(colors)[colorKeyNumber];
      const color = colorKey
        .replace(
          /(?:^|\.?)([A-Z])/g, (x, y) => '-' + y.toLowerCase()
        ).replace(/^-/, '');
      CrafterAvatar.colors.set(key, colorKeyNumber);
      return color;
    }
    return 'accent';
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

