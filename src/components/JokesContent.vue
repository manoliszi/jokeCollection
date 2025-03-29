<template>
    <v-snackbar
      v-model="snackbar"
      :color="'error'"
      :timeout="3000"
      density="compact"
    >
        <p style="margin-bottom: 0 !important;">
            {{ snackbarMessage }}
        </p>
    </v-snackbar>

    <v-card-title class="text-h5 mb-4 d-flex flex-column flex-md-row align-md-center">
        <div class="d-flex flex-column flex-md-row align-center">
            {{ homeCaller ? 'Joke List' : 'My Favorite Jokes' }}

            <v-chip v-if="!homeCaller" color="primary" variant="tonal" class="ml-2 text-white">
                {{ sortedJokes.length }} Jokes Saved
            </v-chip>
        </div>
        <v-spacer />
        <v-text-field
            v-if="!homeCaller"
            v-model="search"
            label="Search jokes..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="mr-4"
        />
        <v-spacer />
        <v-switch v-if="homeCaller" v-model="jokeType" color="primary" label="Programming Jokes" hide-details />
        <v-divider v-if="homeCaller" vertical class="ma-4" />
        <app-button color="primary" :disabled="loading" :label="homeCaller ? 'Find other jokes' : 'Refresh'" variant="outlined"
            @click="fetchOtherJokes" />
        <app-button variant="outlined" color="primary" :label="sortAscending ? 'A-Z' : 'Z-A'" 
            :icon="sortAscending ? 'mdi-arrow-up' : 'mdi-arrow-down'" icon-size="large" @click="toggleSort" />
    </v-card-title>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <v-row>
        <v-col v-if="sortedJokes.length !== 0" v-for="(joke, index) in sortedJokes" :key="joke.id" cols="12" md="6">
            <v-card :color="flippedCards[index] ? 'secondary200' : 'primary200'" class="flip-card"
                :class="{ flipped: flippedCards[index] }" @click="toggleFlip(index)">
                <div class="flip-card-inner">
                    <div class="flip-card-front d-flex align-center justify-center pa-4 primary">
                        <h3 class="text-center">{{ joke.setup }}</h3>
                    </div>

                    <div class="flip-card-back d-flex align-center justify-center pa-4">
                        <h3 class="text-center">{{ joke.punchline }}</h3>
                    </div>

                    <app-button :icon="isFavorite(joke.id) ? 'mdi-star' : 'mdi-star-outline'"
                        :color="isFavorite(joke.id) ? 'yellow' : 'grey'" @click.stop="toggleFavorite(joke.id)" />
                </div>
            </v-card>
        </v-col>
        <v-col v-else-if="sortedJokes.length === 0 && !loading">
            <v-card-text class="text-h4 text-center">
                Oops! No jokes to display
            </v-card-text>
        </v-col>
    </v-row>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { useMainStore } from "@/stores/index.js";
import AppButton from "@/components/AppButton.vue"
import {useRoute} from "vue-router";

const store = useMainStore();
const route = useRoute();

const snackbar = ref(false);
const snackbarMessage = ref('');
const jokeType = ref(false);
const flippedCards = ref([]);
const search = ref("");
const sortAscending = ref(true);

const loading = computed(() => store.loading);
const jokes = computed(() => store.jokes || []);
const homeCaller = computed(() => {
    return route.name === 'Home'
})
const sortedJokes = computed(() => {
    let filteredJokes = jokes.value.filter(joke =>
        joke.setup.toLowerCase().includes(search.value.toLowerCase()) ||
        joke.punchline.toLowerCase().includes(search.value.toLowerCase())
    );

    return filteredJokes.sort((a, b) => {
        if (sortAscending.value) {
            return a.setup.localeCompare(b.setup);
        } else {
            return b.setup.localeCompare(a.setup);
        }
    });
});

onMounted(async () => {
    let resp;
    if (homeCaller.value) {
        resp = await store.fetchJokes();
    } else {
        resp = await store.fetchJokesByIds();
    }
    if (!resp.ok) {
        snackbarMessage.value = 'Oops! Looks like we can\'t fetch your jokes right now. Please try again later!'
        snackbar.value = true
    } 
});

const toggleFlip = (index) => {
    flippedCards.value[index] = !flippedCards.value[index];
};

async function fetchOtherJokes() {
    flippedCards.value = []
    search.value = ''
    let resp;
    if (homeCaller.value) {
        resp = await store.fetchJokes(jokeType.value ? 'programming' : '')
    } else {
        resp = await store.fetchJokesByIds();
    }
    if (!resp.ok) {
        snackbarMessage.value = 'Oops! Looks like we can\'t fetch your jokes right now. Please try again later!'
        snackbar.value = true
    }
}

function toggleFavorite(jokeId) {
    if (isFavorite(jokeId)) {
        store.removeFavorite(jokeId);
    } else {
        store.addFavorite(jokeId);
    }
}

function isFavorite(jokeId) {
    return store.favoriteJokes.includes(jokeId);
}

function toggleSort() {
    sortAscending.value = !sortAscending.value;
}
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
  height: 200px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>