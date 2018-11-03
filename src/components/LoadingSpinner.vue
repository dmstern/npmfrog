<template>
  <v-container fluid class="laoding-spinner">
    <v-alert
      v-if="error.show"
      :value="true"
      type="error"
      >
      <h3 class="heading">
        {{error.status}}
        {{error.statusText}}
      </h3>
      {{error.msg}}
    </v-alert>

    <div 
      v-else
      class="text-xs-center"
    >
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
import { EventBus, Errors } from '@/services/event-bus';

@Component({
  name: 'LoadingSpinner',
})
export default class LoadingSpinner extends Vue {
  @Prop() private msg!: string;
  private error: {
    show: boolean;
    msg: string;
    status: number;
    statusText: string;
  } = {
    show: false,
    msg: '',
    status: 0,
    statusText: '',
  };

  constructor() {
    super();
    EventBus.$on(Errors.SERVER_ERROR, error => {
      const res = error.response;
      this.error.show = true;
      console.log(error);
      if (res) {
        this.error.msg = res.data;
        this.error.status = res.status;
        this.error.statusText = res.statusText;
      }
    });
  }
}
</script>

<style lang="scss">
.v-alert .heading {
  margin-top: 0;
}
</style>
