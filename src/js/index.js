import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput(); // 1. viewからqueryを取得
  if(query) {
    state.search = new Search(query); // 2. searchオブジェクトを作成し、stateに保持
    searchView.clearInput(); // 3. 次の検索の為に入力フォームをリセット
    searchView.clearResults(); // 4. 検索結果を空にする
    await state.search.getResults(); // 5. レシピを検索
    searchView.renderResults(state.search.result); // 5. 検索結果をviewに表示
  }
}

// 検索ボタンに検索処理を実装(ボタンクリック駆動)
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})