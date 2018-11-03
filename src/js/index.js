import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput(); // 1. viewからqueryを取得
  if(query) {
    state.search = new Search(query); // 2. searchオブジェクトを作成し、stateに保持

    searchView.clearInput(); // 3. 次の検索の為に入力フォームをリセット
    searchView.clearResults(); // 4. 検索結果を空にする
    renderLoader(elements.searchResult); // ローダーを表示

    await state.search.getResults(); // 5. レシピを検索

    clearLoader(); // ローダーを削除
    searchView.renderResults(state.search.result); // 5. 検索結果を表示
  }
};

// 検索ボタンに検索処理を実装(ボタンクリック駆動)
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

// ページネーションボタンを押した際のページ切り替え処理
elements.searchResultPages.addEventListener('click', e => {
  // e.target.closetでクリックした際に外枠の要素を検知(classについては、searchViewのcrateButtonを参照)
  const btn = e.target.closest('.btn-inline');
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults(); // 検索結果を空にする
    searchView.renderResults(state.search.result, goToPage); // 検索結果を表示
    console.log(goToPage);
  }
});
