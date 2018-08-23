<template>
    <v-dialog
      v-model="dialog"
      width="500"
    >

      <v-list-tile slot="activator">
        <v-list-tile-action>
          <v-icon>mdi-information-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>About</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-card>
        <v-card-title
          class="headline lighten-2"
          primary-title
        >
          About npmFrog
        </v-card-title>

        <v-card-text>
          <p>
            Version: {{data.meta.version}}
          </p>
          <p>&copy; {{ new Date().getFullYear() }} by ]init[ PixelSchubser Unit</p>
          
          <v-divider />
          <p>Logo icons designed by Freepik and Dimitry Miroliubov from <a href="//www.flaticon.com" target="_blank">Flaticon</a></p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BackendApi from '@/services/BackendApi';

@Component({
  name: 'About',
})
export default class About extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private dataProp!: {
    meta: {},
  };
  private dialog: boolean = this.dialogOpen;
  private data: {
    meta: {},
  } = this.dataProp;

  constructor() {
    super();
    this.dialog = false;
    this.data = {
      meta: {},
    };
    this.loadMetaInfo();
  }

  private loadMetaInfo() {
    BackendApi.Instance.getMetaInfo().then((response) => {
      this.data.meta = response.data;
    });
  }
}

</script>
