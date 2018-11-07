import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};

// 材料の量を数字と分数で返す
const formatCount = count => {
  if(count) {
    // 2.5 => 2 1/2 | 0.5 => 1/2
    const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10)); // 数字と分数に切り分け

    if(!dec) return count; // 分数がない場合

    if(int === 0) { // 数字が0の場合
      const fr = new Fraction(count);
      return `${fr.numerator}/${fr.denominator}`; // 与えられた数字を分数にして返す
    } else { // 数字が0より大きい場合
      const fr = new Fraction(count - int); // 元の数字から切り分けられた数字を引く (例：2.5 → 2.5 - 2 = 0.5)
      return `${int} ${fr.numerator}/${fr.denominator}` // 残った数字を分数にして返す
    }
  }
  return '?';
};

// 材料リストをレンダリング
const createIngredient = ingredient => `
  <li class="recipe__item">
    <svg class="recipe__icon">
      <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
      <span class="recipe__unit">${ingredient.unit}</span>
      ${ingredient.ingredient}
    </div>
  </li>
`;

// レシピ詳細画面をレンダリング
export const renderRecipe = recipe => {
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
          <button class="btn-tiny btn-decrease">
            <svg>
              <use href="img/icons.svg#icon-circle-with-minus"></use>
            </svg>
          </button>
          <button class="btn-tiny btn-increase">
            <svg>
              <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
          </button>
        </div>

      </div>
      <button class="recipe__love">
        <svg class="header__likes">
          <use href="img/icons.svg#icon-heart-outlined"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createIngredient(el)).join('')}
      </ul>

      <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
          <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
      </button>
    </div>

    <div class="recipe__directions">
      <h2 class="heading-2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
      </p>
      <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
      </a>
    </div>
  `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// 食数の変更を再レンダリング
export const updateServingsIngredients = recipe => {
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings; // 材料の食数を更新

  const countElements = Array.from(document.querySelectorAll('.recipe__count')); // 材料を表示する要素を配列で取得
  countElements.forEach((el, i) => { // 要素をfor文で回し、各食材の量を最適化したものをtextContentに格納
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};