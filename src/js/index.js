import Search from './models/Search';
import Recipe from './models/Recipe';
import List   from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView   from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};
window.state = state;

/****************************** Searchコントローラ ******************************/
const controlSearch = async() => {
  const query = searchView.getInput(); // viewからqueryを取得

  if(query) {
    state.search = new Search(query); // searchオブジェクトを作成し、stateに保持
    searchView.clearInput(); // 次の検索の為に入力フォームをリセット
    searchView.clearResults(); // 検索結果を空にする
    renderLoader(elements.searchResult); // ローダーを表示

    try {
      await state.search.getResults(); // レシピを検索
      clearLoader(); // ローダーを削除
      searchView.renderResults(state.search.result); // 5. 検索結果を表示
    } catch(error) {
      alert(error);
      throw new Error(error);
      clearLoader(); // ローダーを削除
    }
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
/****************************** Searchコントローラ ******************************/



/****************************** Recipeコントローラ ******************************/
const controlRecipe = async() => {
  const id = window.location.hash.replace('#', ''); // urlからrecipe idを取得

  if(id) {
    recipeView.clearRecipe(); //レシピ詳細画面を空にする
    renderLoader(elements.recipe); //ローディングアイコン表示

    searchView.highlightSelected(id); // 左側のリストの中から閲覧中のレシピをハイライト

    state.recipe = new Recipe(id); // recipe idを引数にrecipeオブジェクトを生成
    try {
      await state.recipe.getRecipe(); // レシピの詳細を取得
      state.recipe.parseIngredients(); // 材料の量を取得
      state.recipe.calcTime(); // 調理時間を算出
      state.recipe.calcServings(); // 材料の分量を算出
      clearLoader(); // ローディングアイコン非表示
      recipeView.renderRecipe(state.recipe); // レシピの詳細を表示
    } catch(error) {
      alert(error);
      throw new Error(error);
    }
  }
};
/****************************** Recipeコントローラ ******************************/


/****************************** List(shopping)コントローラ ******************************/
const controlList = () => {
  if(!state.list) state.list = new List(); // リストがない場合、Listオブジェクトを生成
  state.recipe.ingredients.forEach(el => { // 材料の配列をショッピングリストに追加
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}
/****************************** List(shopping)コントローラ ******************************/

// ショッピングリスト関連のイベントリスナ
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id); //配列からデータ削除
    listView.deleteItem(id); // UI削除
  } else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val); //材料の量を更新
  }
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); //urlの#recipe_idが変化した時, 画面をロードした時にrecipe_idを取得するイベントリスナ

// 材料増減ボタンをクリックした際の処理
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')){ // btn-decreaseエレメントとbtn-decreaseエレメントの子エレメントにマッチした場合
    if(state.recipe.servings > 1) { // 食数が1より大きい場合のみ食数を減らせる
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe); // 材料を再レンダリング
    }
  } else if(e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe); // 材料を再レンダリング
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) { // add to shopping listをクリックした際の処理
    controlList(); // 右側のshoppingリストを更新
  }
});


