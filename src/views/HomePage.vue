<template>
  <v-container>
    <v-card-title class="text-h5 mb-4 d-flex align-center">
      Jokes List
      <v-spacer />
      <v-switch v-model="jokeType" color="primary" label="Programming" hide-details />
      <v-divider vertical class="ma-4" />
      <app-button color="primary" :disabled="loading" label="Find other jokes" variant="outlined" @click="store.fetchJokes(jokeType ? 'programming' : '')" />
    </v-card-title>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <v-row>
      <v-col v-for="(joke, index) in jokes" :key="joke.id" cols="12" md="6">
        <v-card
          :color="flippedCards[index] ? 'secondary200' : 'primary200'"
          class="flip-card"
          :class="{ flipped: flippedCards[index] }"
          @click="toggleFlip(index)"
        >
          <div class="flip-card-inner">
            <div class="flip-card-front d-flex align-center justify-center pa-4 primary">
              <h3 class="text-center">{{ joke.setup }}</h3>
            </div>

            <div class="flip-card-back d-flex align-center justify-center pa-4">
              <h3 class="text-center">{{ joke.punchline }}</h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { useMainStore } from "@/stores/index.js";
import AppButton from "@/components/AppButton.vue"

const snackbar = ref(false);
const snackbarMessage = ref('');

const jokeType = ref(false);
const store = useMainStore();
const flippedCards = ref([]);
const loading = computed(() => store.loading);
const jokes = computed(() => store.jokes);

onMounted(() => {
  store.fetchJokes();
});

const toggleFlip = (index) => {
  flippedCards.value[index] = !flippedCards.value[index];
};

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