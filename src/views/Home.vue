<template>
  <div class="home">
    <v-alert
      type="warning"
      :value="data.status.toString() === '1'"
    >
      It looks like this is your first startup and npmFrog hasn't set up correctly.
      Please open the config file <code>~/.npmfrog/config.json</code> in the server's home directory and change the defaults to your artifacory properties and restart the server.
    </v-alert>
    <PackageList :class="data.status.toString() !== '2' ? 'hidden' : ''" startMsg="Loading packages..."/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PackageList from '@/components/PackageList.vue';
import DataStore from '@/services/DataStore';
import { Status } from '../../types/Config';

@Component({
  components: {
    PackageList,
  },
})
export default class Home extends Vue {
  private data: {
    status: Status;
  };

  constructor() {
    super();
    this.data = {
      status: Status.loading,
    };
    this.getStatus();
  }

  private getStatus(): void {
    DataStore.Instance.getConfig().then(config => {
      if (config && config.artifactory.host.startsWith('<')) {
        this.data.status = Status.firstStartUp;
      } else {
        this.data.status = Status.configured;
      }
    });
  }
}
</script>
