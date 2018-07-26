<template>
  <div class="home">
    <Packages startMsg="Loading packages..."/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Packages from '@/components/Packages.vue';

@Component({
  components: {
    Packages,
  },
})
export default class Home extends Vue {}
</script>
