<template>

<div class="CrafterAvatar">
  <v-avatar
    :title="crafter.name"
    :color="`${color} lighten-1`"
    size="32"
  >
    {{crafter.initials}}
  </v-avatar>
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

  @Prop() private crafter!: Crafter;

  constructor() {
    super();
  }

  private get color(): string {
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
      let colorKeyNumber = (initials.charCodeAt(0) + initials.charCodeAt(0)) % (Object.keys(colors).length - 2);
      CrafterAvatar.colors.forEach((oldKey) => {
        if (oldKey === colorKeyNumber) {
          colorKeyNumber++;
          if (colorKeyNumber >= Object.keys(colors).length - 2) {
            colorKeyNumber -= 2;
          }
        }
      });
      const colorKey = Object.keys(colors)[colorKeyNumber];
      const color = colorKey.replace(/(?:^|\.?)([A-Z])/g, (x, y) => {
        return '-' + y.toLowerCase();
      }).replace(/^-/, '');
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

