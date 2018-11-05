import axios from 'axios';
import { proxy, apiKey } from '../config'

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(`${proxy}http://food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
      console.log(result);
      this.title       = result.data.recipe.title;
      this.author      = result.data.recipe.publisher;
      this.img         = result.data.recipe.image_url;
      this.url         = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      alert(error);
      throw new Error(error);
    }
  }

  // 調理時間の概算
  calcTime() {
    const numIng  = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time     = periods * 15;
  }

  // 材料何食分かを算出
  calcServings() {
    this.servings = 4;
  }
}