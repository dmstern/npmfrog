<template>
  <div class="about">
    <h2>{{this.$route.params.scope? `${this.$route.params.scope}/` : ''}}{{this.$route.params.packageName}}</h2>
  </div>
</template>
