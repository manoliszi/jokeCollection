// Utilities
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      jokeArray: [],
      loadingIndication: false,
      favoriteJokesArray: []
    }
  },
  actions: {
    async fetchJokes(type = '') {
      this.loadingIndication = true;
      try {
        if (type !== '') {
          type = '/' + type
        }
        const response = await axios.get(`https://official-joke-api.appspot.com/jokes${type}/ten`);
        this.jokeArray = response.data;
        return {ok: true}
      } catch (error) {
        console.error("Error fetching jokes:", error);
        return {ok: false}
      } finally {
        this.loadingIndication = false;
      }
    },
    addFavorite(jokeId) {
      if (!this.favoriteJokesArray.includes(jokeId)) {
        this.favoriteJokesArray.push(jokeId);
      }
    },
    removeFavorite(jokeId) {
      this.favoriteJokesArray = this.favoriteJokesArray.filter(id => id !== jokeId);
    }
  },
  getters: {
    jokes: (state) => state.jokeArray,
    loading: (state) => state.loadingIndication,
    favoriteJokes: (state) => state.favoriteJokesArray
  }
})
