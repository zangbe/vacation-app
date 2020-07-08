<template>
    <v-card flat tile>
        <v-toolbar dense>

        <v-toolbar-title>Vacation App</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="isAuthenticated" icon @click="onClickLogout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
        </v-toolbar>
    </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    
    computed: {
        ...mapGetters({
            isAuthenticated: 'isAuthenticated'
        })
    },

    methods: {
        ...mapMutations({
            LOGOUT: 'LOGOUT'
        }),

        onClickLogout() {
            this.LOGOUT();
            this.$router.push('/');
        }
    },
}
</script>