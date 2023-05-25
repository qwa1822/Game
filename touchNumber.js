import { TOUCH_NUMBER_SCORE_KEY } from "./constants/localstorage.js";
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import {
  getNowTime,
  getResultTimeString,
  setTimer,
  startTimer,
  stopTimer,
} from "./utils/timer.js";

const numberButtonList = document.getElementsByClassName("number-button");

const maxId = numberButtonList.length;

let currentNumber = 1;

const handleSuccessGame = onTimeOver => {
  stopTimer();

  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });

  const nowSpendTime = getNowTime();

  const currentSpendTime = localStorage.getItem(TOUCH_NUMBER_SCORE_KEY);
  if (!currentSpendTime || currentSpendTime > nowSpendTime) {
    localStorage.setItem(TOUCH_NUMBER_SCORE_KEY, nowSpendTime);
  }
  setTimer(0);
};

const handleFailedGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};

// number-button
const setButtonDOM = () => {
  // 1. HTML상에서  domlist를 받아옴
  // 2. 순회하면서 dom의 위치를 조정(랜덤으로)
  // 3. dom 클릭시 핸들러 등록
  //

  for (let numberButton of numberButtonList) {
    // (0~100%)=>(0~90%)
    numberButton.style.display = "block";
    numberButton.style.top = `${Math.floor(Math.random() * 100 * 0.9)}%`;
    numberButton.style.left = `${Math.floor(Math.random() * 100 * 0.9)}%`;

    numberButton.onclick = event => {
      // 1.클릭한 수를 찾아오기
      // 2. 수가 현재 클릭되어야 하는 수가 맞는지 판단 -> 아니라면 무시, 맞다면 해당 numberButton을 없앰
      // 3.1을 클릭했을 때는 startTimer를 시작
      // 4. 10을 클릭했을 때는 타이머 멈춤 -> 성공 모달
      const numbId = Number(event.target.innerHTML); //숫자 받아오기

      if (isNaN(numbId)) return;
      if (numbId !== currentNumber) {
        return;
      }
      event.target.style.display = "none";
      if (numbId === maxId) {
        // 성공모달
        handleSuccessGame();
        return;
      }

      if (numbId === 1) {
        startTimer(handleFailedGame);
      }
      currentNumber++;
    };
  }
};

const intializeTouchNumberGame = () => {
  // 타이머를 다시 세팅
  // 숫자의 위치를 다시 세팅
  // 숫자가다시 나타날 수 있게
  // currentNumber=1;

  setTimer(0);
  stopTimer();
  setButtonDOM();
  currentNumber = 1;
};

const initialize = () => {
  // modal-retry, header- retry 세팅
  // 클릭시 모달 닫기 timer 0;
  // 모든 상태를 원복

  const [headerRetryButton, modalRetryButton] =
    document.getElementsByClassName("retry-button");
  headerRetryButton.onclick = () => {
    handleModalClose(intializeTouchNumberGame);
  };
  modalRetryButton.onclick = () => {
    handleModalClose(intializeTouchNumberGame);
  };
};
setButtonDOM();

initialize();
