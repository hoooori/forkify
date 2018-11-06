export const elements = {
  searchForm:        document.querySelector('.search'),
  searchInput:       document.querySelector('.search__field'),
  searchResult:      document.querySelector('.results'), // ローディングアイコン
  searchResultList:  document.querySelector('.results__list'), // 検索結果
  searchResultPages: document.querySelector('.results__pages'), // ページネーション
  recipe:            document.querySelector('.recipe') // レシピ詳細画面のローディングアイコン
};

export const elementStrings = {
  loader: 'loader'
};

// 読み込みアイコンの表示
export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

// 読み込みアイコンの非表示
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if(loader) { loader.parentElement.removeChild(loader); }
};
