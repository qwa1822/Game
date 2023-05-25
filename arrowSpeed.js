import { ARROW_SPEED_SCORE_KEY } from "./constants/localstorage.js";
import { makeDOMwithProperties } from "./utils/dom.js";
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import {
  getNowTime,
  getResultTimeString,
  setTimer,
  startTimer,
  stopTimer,
} from "./utils/timer.js";

const MAX_ARROW = 8; //화살표의 갯수
const MAX_ROUND = 3;

let arrowDOMList = [];

const arrowFIeldDOM = document.getElementById("arrow-field");

let currentIndex = 0;

let round = 1;

const clearArrowDOM = () => {
  arrowDOMList.forEach(arrowDOM => {
    //기존 arrowDom이있다면 삭제
    arrowDOM.remove();
  });

  arrowDOMList = [];
};

const setArrowDOM = () => {
  // 1. 기존에 존재하고 있던 arrowDoM이 있으면 삭제
  // 2. 새로 DOM을 만들어서 세팅
  // 3. 랜덤으로 왼쪽, 오른쪽을 결정

  clearArrowDOM();

  for (let i = 0; i < MAX_ARROW; i++) {
    // 0.0..1 ~0.9999..99
    const direction = Math.random() < 0.5 ? "left" : "right"; //50%확률
    const arrowDOM = makeDOMwithProperties("span", {
      className: `arrow arrow-${direction}`,
      innerHTML: direction === "left" ? "&lt;" : "&gt;",
    });

    arrowDOMList.push(arrowDOM);
    arrowFIeldDOM.appendChild(arrowDOM);
  }
};

const handleSuccessGame = () => {
  // 타이머를 멈추고 -> 모달을 띄워서 성공시간을 노출 -> 타이머를 0으로 세팅
  // localStorage 최소소요시간을 저장

  stopTimer();
  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });
  const nowSpentTime = getNowTime();
  const currentSpentTime = localStorage.getItem(ARROW_SPEED_SCORE_KEY);
  if (!currentSpentTime || currentSpentTime > nowSpentTime) {
    localStorage.setItem(ARROW_SPEED_SCORE_KEY, nowSpentTime);
  }
  setTimer(0);

  console.log("성공!");
};

const handleFailGame = () => {
  console.log("실패!");
  stopTimer();
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};

const setKeyboardEvent = () => {
  // 이벤트 핸들러 등록=> keydown
  // 왼쪽 방향키  || 오른쪽 방향키가 클릭되면
  // 현재 눌려져야 할 방향키 방향과 같다면

  const handleCorrect = () => {
    // 방향키 DOM을 안보이게 만들어야함
    // currentIndex++;

    arrowDOMList[currentIndex].style.display = "none";
    currentIndex++;

    // 모든 방향키가 다 눌렸다면 다음 라운드로 ()
    if (currentIndex === MAX_ARROW) {
      if (round === MAX_ROUND) {
        // 게임종료
        handleSuccessGame();
        return;
      }
      currentIndex = 0;
      setArrowDOM();
      round += 1;
    }
  };

  window.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.code)) return;

    const isFirst = currentIndex === 0 && round === 1;
    if (isFirst) startTimer(handleFailGame);

    const isLeft = (arrowDOMList[currentIndex].innerHTML = "&lt;");

    if (isLeft && event.code === "ArrowLeft") {
      handleCorrect();
    }
    if (!isLeft & (event.code === "ArrowRight")) {
      handleCorrect();
    }
  });

  // arrowDOMList[currentIndex].innerHTML === "&lt"; //왼쪽방향키를 입력해야 함
};

const onArrowSpeedGameEnd = () => {
  stopTimer();
  setTimer(0);
  currentIndex = 0;
  round = 1;
  setArrowDOM();
};

const initialize = () => {
  // retyButton timer세팅과 상태원복 코드를 삽입 모달닫기,상태원복 코드를삽입
  const [headerRetryButton, modalRetryButton] =
    document.getElementsByClassName("retry-button");

  headerRetryButton.onclick = () => {
    handleModalClose(onArrowSpeedGameEnd); //모달잉 닫히면서 실행
  };
  modalRetryButton.onclick = () => {
    handleModalClose(onArrowSpeedGameEnd);
  };
};

// handleCorrect

setArrowDOM();
setKeyboardEvent();
initialize();
