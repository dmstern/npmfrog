<template>
  <div class="modules">
    This file will list all the posts.
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModulesService from '@/services/ModulesService';

@Component
export default class Modules extends Vue {
  @Prop() private msg!: string;

  constructor() {
    super();
    this.getModules();
  }

  public async getModules() {
    ModulesService.fetchModules().then((response) => {
      this.msg = response.data;
    });
  }

}
</script>
