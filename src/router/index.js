import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomePage.vue';
import ProfileView from '@/views/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
