import axios from 'axios';
import { proxy, apiKey } from '../config'

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
      this.result = res.data.recipes;
    } catch(error) {
      alert(error);
    }
  }
}
