<template>
  <div class="home">
    <PackageList startMsg="Loading packages..."/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PackageList from '@/components/PackageList.vue';

@Component({
  components: {
    PackageList,
  },
})
export default class Home extends Vue {}
</script>
