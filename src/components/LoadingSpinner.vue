<template>
  <v-container fluid>
  <div class="text-xs-center">
    <v-progress-circular 
        indeterminate
        color="secondary"
      ></v-progress-circular>
    <div class="loading-message">{{msg}}</div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'LoadingSpinner',
})
export default class LoadingSpinner extends Vue {
  @Prop() private msg!: string;

  constructor() {
    super();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
