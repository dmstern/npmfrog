<template>
  <div class="home">
    <Modules packagesProp="Loading packages..."/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modules from '@/components/Modules.vue';

@Component({
  components: {
    Modules,
  },
})
export default class Home extends Vue {}
</script>
