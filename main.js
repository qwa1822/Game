import {
  ARROW_SPEED_SCORE_KEY,
  MOUSE_CONTROL_SCORE_KEY,
  TOUCH_NUMBER_SCORE_KEY,
} from "./constants/localstorage.js";
import { appendChildrenList, makeDOMwithProperties } from "./utils/dom.js";
import { getTimeString } from "./utils/timer.js";

{
  /* <a class='game-card' href="touch_number.html">
<img src='public/assets/touch_number_thumbnail.png' alt='숫자 클릭 게임' />
<div class='game-title'>숫자 클릭 게임</div>
<div class='game-result'>최고기록 : 10:25:00</div>
</a> --> */
}

const gameInfoList = [
  {
    id: 1,
    title: "마우스 컨트롤 게임",
    url: "mouse_control.html",
    thumnail: "public/assets/mouse_control_thumbnail.png",
    isNew: false,
  },

  {
    id: 2,
    title: "숫자 클릭 게임",
    url: "touch_number.html",
    thumnail: "public/assets/touch_number_thumbnail.png",
    isNew: true,
  },
  {
    id: 3,
    title: "방향키게임",
    url: "arrow_speed.html",
    thumnail: "public/assets/arrow_speed_thumbnail.png",
    isNew: false,
  },
];

const localStorageKeyMap = {
  1: MOUSE_CONTROL_SCORE_KEY,
  2: TOUCH_NUMBER_SCORE_KEY,
  3: ARROW_SPEED_SCORE_KEY,
};

const getGameCard = ({ id, url, thumnail, title, isNew }) => {
  const gameCardDOM = makeDOMwithProperties("a", {
    className: "game-card",
    href: url,
  });
  const thumbnailDOM = makeDOMwithProperties("img", {
    src: thumnail,
    alt: title,
  });

  const newBadgeDOM = isNew
    ? makeDOMwithProperties("span", {
        className: "game-new-badge",
        innerHTML: "new",
      })
    : null;
  const titleDOM = makeDOMwithProperties("div", {
    className: "game-title",
    innerHTML: title,
  });
  const result = localStorage.getItem(localStorageKeyMap[id]);
  const resultDOM = makeDOMwithProperties("div", {
    className: "game-result",
    innerHTML: result ? `최고기록 :${getTimeString(result)}` : "도전해보세여",
  });

  appendChildrenList(gameCardDOM, [
    thumbnailDOM,
    newBadgeDOM,
    titleDOM,
    resultDOM,
  ]);

  return gameCardDOM;
};
const gameListContainer = document.getElementById("game-list-container");
gameInfoList.forEach(gameInfo => {
  const cardDom = getGameCard(gameInfo);
  gameListContainer.appendChild(cardDom);
});
