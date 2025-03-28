<template>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item title="My Jokes Application"></v-list-item>

        <v-divider></v-divider>

        <v-list-item 
          v-for="item in menuItems" 
          :key="item.title" 
          :to="item.route"
          :prepend-icon="item.icon"
          color="primary"
          link
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="secondary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Jokes Application</v-toolbar-title>
    </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);

const menuItems = [
  { title: "Home", route: "/", icon: "mdi-home" },
  { title: "Profile", route: "/profile", icon: "mdi-account" }
];
</script>