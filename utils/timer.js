let time = 0;

const MAX_TIME = 3600 * 24; //최대 시간은 24시간
export let isGameStart = false;

let timerId = null;
const TimerDOM = document.getElementsByClassName("game-time")[0];

const convertTwoNumber = number => {
  const stringNum = `${number}`;
  if (stringNum.length === 1) return `0${stringNum}`;
  else return stringNum;
};

export const getTimeString = time => {
  //e.g time=0, return "00:00:00"

  const hour = Math.floor(time / 3600);
  time = time - hour * 3600;
  const minute = Math.floor(time / 60);
  time = time - minute * 60;
  const second = time;

  return `${convertTwoNumber(hour)}: ${convertTwoNumber(
    minute
  )}: ${convertTwoNumber(second)}`;
};

export const startTimer = onTimeOver => {
  isGameStart = true;
  timerId = setInterval(() => {
    time++;
    TimerDOM.innerHTML = getTimeString(time); // 0-> 00 : 00 : 00

    if (MAX_TIME < time) {
      //시간초과
      onTimeOver?.();
      clearInterval(timerId);
    }
  }, 1000);
};

export const stopTimer = () => {
  isGameStart = false;
  if (timerId === null) return;
  clearInterval(timerId);
};

export const setTimer = infoTime => {
  time = infoTime;
  TimerDOM.innerHTML = getTimeString(time);
};

export const getResultTimeString = () => {
  return getTimeString(time);
};

export const getNowTime = () => {
  return time;
};
