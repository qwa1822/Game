import { initBoxState, setBoxDOM } from "./module/mouseControlModule.js";
import { handleModalClose } from "./utils/modal.js";

const initialize = () => {
  // modal의 버튼을 세팅
  // retryButton에 게임 상태를 원복하는 함수를 실행
  const retryButton = document.getElementsByClassName("retry-button")[0];

  retryButton.onClick = () => {
    handleModalClose(initBoxState);
    // 게임상태 원복
  };
};

setBoxDOM({
  row: 5,
  col: 5,
  start: [0, 0],
  end: [4, 4],
  walls: [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [3, 0],
    [3, 1],

    [3, 3],
    [3, 4],
  ],
});

// 벽의 위치
//    0  1 2 3 4
// 0  s
// 1  w w w w
// 2
// 3    w w w w
// 4            e

initialize();
