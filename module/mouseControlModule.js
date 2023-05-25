import { MOUSE_CONTROL_SCORE_KEY } from "../constants/localstorage.js";
import { makeDOMwithProperties } from "../utils/dom.js";
import { handleModalClose, handleModalOpen } from "../utils/modal.js";
import {
  getNowTime,
  getResultTimeString,
  isGameStart,
  setTimer,
  startTimer,
  stopTimer,
} from "../utils/timer.js";

let boxDOMLIst = [];

let wallBoxDOMList = [];
let startBoxDOM = null;
let endBoxDOM = null;

export const initBoxState = () => {
  startBoxDOM.innerHTML = "시작";
  endBoxDOM.innerHTML = `끝`;
  boxDOMLIst.forEach(box => {
    boxDOM.style.backgroundColir = "transparent";
  });
};

const gameFiledDOM = document.getElementById("game-field");

const handleSuccessGame = () => {
  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });

  // 게임 성공 시 loCalStorage에 갱신된 최고 점수(최소 소요 시간) 저장

  const nowSpendTime = getNowTime();
  const currentScoreTime = localStorage.getItem(MOUSE_CONTROL_SCORE_KEY);
  if (!currentScoreTime || currentScoreTime > nowSpendTime) {
    localStorage.setItem(MOUSE_CONTROL_SCORE_KEY, nowSpendTime);
  }
  stopTimer();
  setTimer(0);
  //TODO: 성공 modal 구현
};

const handleFailedGame = () => {
  handleModalClose({
    isSuccess: false,
  });
  stopTimer();
  // 게임싪-> 타이머를 멈추고, 모달이 띄워줘야함
};

export const setBoxDOM = ({
  row, //행이 몇갠지
  col, //열이 몇갠지
  start, //시작 위치[행,열]
  end, //종료위치[행,열],
  walls, // 벽의 위치들[행,열]
}) => {
  //control-box-container를 만들고,
  // box들을 채우기

  const controlBoxContainer = makeDOMwithProperties("div", {
    id: "control-box-container",
    onmouseleave: () => {
      if (!isGameStart) return;
      handleFailedGame();
      // 게임시작 변수가 세팅되었을 때
    },
  });
  controlBoxContainer.style.display = "grid";
  controlBoxContainer.style.gridTemplateRows = `repeat(${row},1fr)`;
  controlBoxContainer.style.gridTemplateColumns = `repeat(${col},1fr)`;

  for (let i = 0; i < row; i++) {
    //행을 1씩 늘려가면서
    for (let j = 0; j < col; j++) {
      //열을 1씩 늘려가면서

      const {
        type,
        className,
        innerHTML = "",
        onmouseover,
      } = (function () {
        if (i === start[0] && j === start[1]) {
          //시작위치
          return {
            type: "start",
            className: "control-box start",
            innerHTML: "시작",
            onmouseover: event => {
              startTimer(handleFailedGame);

              event.target.innerHTML = "";
            },
            // 시작위치에도착하면 게임시작
            // 게임시작-> 타이머가 시작
            // 게임시작 변수변경 !
            // innerHTML을 없ㅇ
          };
        }
        if (i === end[0] && j === end[1]) {
          //종료위치
          return {
            type: "end",
            className: "control-box end",
            innerHTML: "끝",
            onmouseover: () => {
              if (!isGameStart) return; //게임이 시작되어있지 않을떄
              event.target.innerHTML = "";
              handleSuccessGame();
            },

            // 게임시작 변수가 세팅되었을떄
            // 게임종료
          };
        }
        for (let wall of walls) {
          //벽의 위치
          if (i === wall[0] && j === wall[1]) {
            //벽의 위치
            return {
              type: "wall",
              className: "control-box wall",
              onmouseover: () => {
                if (!isGameStart) return;
                handleFailedGame();
              },
              // 벽에부딪히면
            };
          }
        }
        return {
          // 게임시작 변수가 세팅되었을 때
          type: "normal",
          className: "control-box",
          onmouseover: event => {
            if (!isGameStart) return;

            event.target.style.background = "red";
          },
        };
      })();
      const boxDOM = makeDOMwithProperties("div", {
        className,
        innerHTML,
        id: `box-${i}-${j}`,
        onmouseover,
      });
      switch (type) {
        case "start":
          startBoxDOM = boxDOM;
          break;
        case "end":
          endBoxDOM = boxDOM;
          break;
        case "wall":
          wallBoxDOMList.push(boxDOM);
          break;
        default:
          boxDOMLIst.push(boxDOM);
      }
      controlBoxContainer.appendChild(boxDOM);
    }
  }

  gameFiledDOM.appendChild(controlBoxContainer);
  // display:grid;
  // grid-template-row:repeat(3,1fr); //3행
  // grid-template-columns:repeat(4,1fr) //4열
};
