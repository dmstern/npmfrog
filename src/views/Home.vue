<template>
  <div class="home">
    <Modules msgProp="Welcome to Your Vue.js + TypeScript App"/>
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
