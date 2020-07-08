<template>
  <v-app>
    <TopBar />
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <router-view />
        </v-row>
      </v-container>
  </v-app>
</template>

<script>
import TopBar from './components/TopBar';

export default {
  data() {
    return {
      
    }
  },

  components: {
    TopBar
  },

  created() {
    
  },
}
</script>
