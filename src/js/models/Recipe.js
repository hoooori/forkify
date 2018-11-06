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

  parseIngredients() {
    const unitsLong  = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // 材料単位
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']; // 材料単位(省略したもの)
    const units      = [...unitsShort, 'kg', 'g']; // unitsShort配列にkg, gを追加した配列

    // 材料リストをmapで処理
    const newIngredients = this.ingredients.map(el => {
      let ingredient = el.toLowerCase(); // 材料を小文字に変換

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]); // ingredientと同じunitを見つけらたら、ingredientを単位省略版に置き換える
      });

      ingredient      = ingredient.replace(/ *\([^)]*\) */g, ' '); // 文字列から括弧を取り除く
      const arrIng    = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(targetElement => units.includes(targetElement)); // 材料の配列から"材料の単位"が含まれる配列の要素番号を取得

      let objIng;
      if(unitIndex > -1) { // 単位を含む場合
        // 例1:「4 1/2 cups」の場合、arrCountは「[4, 1/2]」
        // 例2:「4 cups」の場合、arrCountは「4」
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if(arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+')); // 「4-1/2」といった表記を「4+1/2」に変換してevalで計算
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+')); // 「4+1/2」といった計算式を評価する
        }

        objIng = {
          count,
          unit:       arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if(parseInt(arrIng[0], 10)) { // 単位を含まず、最初の要素が数字の場合
        objIng = {
          count:      parseInt(arrIng[0], 10),
          unit:       '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if(unitIndex === -1) { // 単位を含まず、最初の要素も数字じゃない場合
        objIng = {
          count: 1,
          unit:  '',
          ingredient
          // 「ingredient: ingredient」と一緒
        }
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}