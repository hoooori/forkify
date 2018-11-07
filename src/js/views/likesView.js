import { elements }         from './base';
import { limitRecipeTitle } from './searchView';

// likeかdislikeに合わせてhtml要素のクラスを追加・削除する
export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`); // recipe__loveの中にあるuseエレメントのhrefの中身を書き換える
};

//likeメニュー(右上)の表示・非表示
export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// likeリストコンポーネント
export const renderLike = like => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
          <p class="likes__author">${like.author}</p>
        </div>
      </a>
    </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// likeリストから
export const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if(el) el.parentElement.removeChild(el);
}