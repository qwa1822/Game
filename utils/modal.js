const modal = document.getElementsByClassName("modal")[0];
const modalTitle = document.getElementsByClassName("modal-title")[0];
const modalDescription =
  document.getElementsByClassName("modal-description")[0];

export const handleModalOpen = ({ isSuccess, timeString }) => {
  modal.classList.add("open");

  if (isSuccess) {
    modalTitle.innerHTML = `성공!`;
    modalDescription.innerHTML = `${timeString}만에 성공했습니다`;
  } else {
    modalTitle.innerHTML = `실패!`;
    modalDescription.innerHTML = `다시 시도해보세요~`;
  }
};

export const handleModalClose = onModalClose => {
  modal.classList.remove("open");
  onModalClose?.();
};
