// Utilities
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      jokeArray: [],
      loadingIndication: false,
      favoriteJokesArray: JSON.parse(localStorage.getItem('favoriteJokes')) || []
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
    async fetchJokesByIds() {
      this.jokeArray = []
      this.loadingIndication = true;
      try {
        const requests = this.favoriteJokesArray.map(jokeId => 
          axios.get(`https://official-joke-api.appspot.com/jokes/${jokeId}`)
        );
        const responses = await Promise.all(requests);
        this.jokeArray = responses.map(response => response.data);
        return { ok: true };
      } catch (error) {
        console.error("Error fetching favorite jokes:", error);
        return {ok: false}
      } finally {
        this.loadingIndication = false;
      }
    },
    addFavorite(jokeId) {
      if (!this.favoriteJokesArray.includes(jokeId)) {
        this.favoriteJokesArray.push(jokeId);
        localStorage.setItem('favoriteJokes', JSON.stringify(this.favoriteJokesArray));
      }
    },
    removeFavorite(jokeId) {
      this.favoriteJokesArray = this.favoriteJokesArray.filter(id => id !== jokeId);
      localStorage.setItem('favoriteJokes', JSON.stringify(this.favoriteJokesArray));
    }
  },
  getters: {
    jokes: (state) => state.jokeArray,
    loading: (state) => state.loadingIndication,
    favoriteJokes: (state) => state.favoriteJokesArray
  }
})
