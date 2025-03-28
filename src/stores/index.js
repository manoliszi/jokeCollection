// Utilities
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost', timeout: 60000,
  headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
});

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      jokeArray: [],
      loadingIndication: false,
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
      } catch (error) {
        console.error("Error fetching jokes:", error);
      } finally {
        this.loadingIndication = false;
      }
    }
  },
  getters: {
    jokes: (state) => state.jokeArray,
    loading: (state) => state.loadingIndication,
  }
})
