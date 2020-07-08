<template>
  <v-card class="elevation-12" width="500px">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login form</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          label="ID"
          prepend-icon="mdi-account"
          v-model="id"
          type="text"
        ></v-text-field>
        <v-text-field
          id="password"
          label="Password"
          prepend-icon="mdi-lock"
          v-model="password"
          type="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="onClickLoginButton">Login</v-btn>
    </v-card-actions>

    <v-snackbar
          color="red"
          centered
          v-model="snackbar"
      >
      {{ text }}

      <template v-slot:action="{ attrs }">
          <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
          >
          Close
          </v-btn>
      </template>
    </v-snackbar>

  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      snackbar: false,
      text: '',
      id: '',
      password: ''
    }
  },

  methods: {

    ...mapActions([
      'LOGIN'
    ]),

    async onClickLoginButton() {

      try {
        await this.LOGIN({userId: this.id, password: this.password});
      } catch (error) {
        this.text = error;
        this.snackbar = true;
      }
    },
  },
}
</script>
