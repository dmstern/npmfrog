<template>
  <div class="modules">
    <h2>Modules</h2>
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModulesService from '@/services/ModulesService';

@Component
export default class Modules extends Vue {
  @Prop() private msgProp!: string;
  private msg: string = this.msgProp;

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
