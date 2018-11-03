import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResultList.innerHTML  = '';
  elements.searchResultPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit) {
    title.split(' ').reduce((acc, cur) => { // acc: accumulator / cur: current
      if (acc + cur.length <= limit) { newTitle.push(cur); }
      return acc + cur.length;
    }, 0); // ←このゼロはaccumulatorの最初の初期値
    return `${newTitle.join(' ')}...`; // return the result
  }
  return title;
};


const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;
  elements.searchResultList.insertAdjacentHTML('beforeend', markup); //insertAdjacentHTMLは繰り返しviewを生成するのに便利
};

// ページネーションボタンのmarkup生成 type: prev or next
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resultPerPage) => {
  const pages = Math.ceil(numResults / resultPerPage); //繰り上げ
  let button;
  if(page === 1 && pages > 1) { // 最初のページはnextのみ
    button = createButton(page, 'next');
  } else if(page < pages) { //途中のページはnext, back
    button = `
      ${button = createButton(page, 'prev')}
      ${button = createButton(page, 'next')}
    `;
  } else if(page === pages && pages > 1) { // 最後のページはbackのみ
    button = createButton(page, 'prev');
  }
  elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

// ページネーションに合わせたデータの表示
export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
  const start = (page - 1) * resultPerPage;
  const end   = page * resultPerPage;
  recipes.slice(start, end).forEach(renderRecipe); // renderRecipeをfor文で実行

  // ページネーションボタンの表示
  renderButtons(page, recipes.length, resultPerPage);
};
