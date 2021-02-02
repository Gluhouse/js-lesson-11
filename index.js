const app = () => {
  const list = {
    toDo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };

  const addTaskBtn = document.querySelector("#addTaskBtn");
  const darkerPage = document.querySelector(".darker");

  addTaskBtn.addEventListener("click", (event) => {
    openWindow(event, "#addWindow", list.toDo);
  });

  document.querySelectorAll(".card").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest("#toDoCard")) {
        if (event.target.closest(".btn__progress")) {
          nextStep(
            event,
            list.toDo,
            list.inProgress,
            "#toDoCard",
            "#inProgressCard"
          );
        }
      }

      if (event.target.closest("#inProgressCard")) {
        if (event.target.closest(".btn__progress")) {
          nextStep(
            event,
            list.inProgress,
            list.done,
            "#inProgressCard",
            "#doneCard"
          );
        }
      }

      if (event.target.closest(".btn__edit")) {
        let listItem = findListItem(event);
        let index = findItemIndex(event, list[listItem]);
        openWindow(event, "#editWindow", list[listItem], index);
      }

      if (event.target.closest(".btn__delete")) {
        let listItem = findListItem(event);
        let index = findItemIndex(event, list[listItem]);

        deleteItem(event, "#deletedCard", list[listItem], index, list.deleted);
      }
    });

    darkerPage.addEventListener("click", (event) => {
      closeWindow(event, "#addWindow");
      closeWindow(event, "#editWindow");
    });
  });
};

const openWindow = (event, windowName, listItem, index) => {
  let window = document.querySelector(windowName);
  let confirmBtn = window.querySelector(".confirm__btn");
  let inputName = window.querySelector(".input-name");
  let inputDesc = window.querySelector(".input-desc");

  window.style.display = "flex";
  document.querySelector(".darker").style.display = "block";

  window.querySelector(".close__btn").addEventListener("click", () => {
    closeWindow(event, windowName);
  });

  let cardName = event.target.closest(".card").id;

  if (windowName === "#addWindow") {
    inputName.value = "";
    inputDesc.value = "";

    confirmBtn.addEventListener(
      "click",
      (confirmEvent = (event) => {
        confirmInput(event, listItem, false, 0, cardName);
      })
    );
  } else if (windowName === "#editWindow") {
    inputName.value = listItem[index].name;
    inputDesc.value = listItem[index].desc;

    confirmBtn.addEventListener(
      "click",
      (confirmEvent = (event) => {
        confirmInput(event, listItem, true, index, cardName);
      })
    );
  }
};

const closeWindow = (event, windowName) => {
  event.preventDefault();
  document.querySelector(windowName).style.display = "none";
  document.querySelector(".darker").style.display = "none";
  document
    .querySelectorAll(".confirm__btn")
    .forEach((item) => item.removeEventListener("click", confirmEvent));
};

const confirmInput = (event, listItem, isEdit = false, index, cardName) => {
  event.preventDefault();
  let window = event.target.closest("form");
  let nameInput = window.querySelector(".input-name").value;
  let descInput = window.querySelector(".input-desc").value;

  if (isEdit === true) {
    listItem.splice(index, 1, { name: nameInput, desc: descInput });
  } else {
    listItem.push({ name: nameInput, desc: descInput });
  }

  drawCard(`#${cardName}`, listItem);
  closeWindow(event, "#addWindow");
  closeWindow(event, "#editWindow");
};

const drawCard = (cardName, listItem) => {
  card = document.querySelector(cardName);
  tasks = card.querySelector(".tasks");

  tasks.innerHTML = "";

  // if (cardName === "#toDoCard") {
  //   listItem.forEach((elem) => {
  //     tasks.innerHTML += `
  //         <div class="task">
  //         <h2 class="task__name">${elem.name}</h2>
  //         <button class="btn__progress"></button>
  //         <button class="btn__edit"></button>
  //         <button class="btn__delete"></button>
  //         <p class="task__desc">${elem.desc}</p>
  //       </div>`;
  //   });
  // } else if (cardName === "#inProgressCard") {
  //   listItem.forEach((elem) => {
  //     tasks.innerHTML += `
  //       <div class="task">
  //       <h2 class="task__name">${elem.name}</h2>
  //       <button class="btn__progress"></button>
  //       <button class="btn__edit"></button>
  //       <button class="btn__delete"></button>
  //       <p class="task__desc">${elem.desc}</p>
  //     </div>`;
  //   });
  // } else {
  //   listItem.forEach((elem) => {
  //     tasks.innerHTML += `
  //       <div class="task">
  //       <h2 class="task__name">${elem.name}</h2>
  //       <p class="task__desc">${elem.desc}</p>
  //       <span class="lime">COMPLETED</span>
  //     </div>`;
  //   });
  // }

  listItem.forEach((elem) => {
    tasks.innerHTML += `
          <div class="task">
          <h2 class="task__name">${elem.name}</h2>
          ${
            cardName === "#toDoCard" || cardName === "#inProgressCard"
              ? `
              <button class="btn__progress"></button>
              <button class="btn__edit"></button>
              <button class="btn__delete"></button>`
              : ``
          }
          <p class="task__desc">${elem.desc}</p>
          ${
            cardName === "#doneCard"
              ? `<span class="lime">COMPLETED</span>`
              : ``
          }
          ${
            cardName === "#deletedCard"
              ? `<span class="red">DELETED</span>`
              : ``
          }
          
        </div>`;
  });
};

const nextStep = (
  event,
  currentListItem,
  nextListItem,
  currentCardName,
  nextCardName
) => {
  let window = event.target.closest(".task");
  let taskName = window.querySelector(".task__name").textContent;
  let taskDesc = window.querySelector(".task__desc").textContent;

  let index = currentListItem.findIndex(
    (item) => item.name === taskName && item.desc === taskDesc
  );

  let tempList = currentListItem.splice(index, 1);

  nextListItem.push(tempList.pop());

  drawCard(currentCardName, currentListItem);
  drawCard(nextCardName, nextListItem);
};

const findListItem = (event) => {
  let window = event.target.closest(".card").id;

  listItem = window.replace("Card", "");

  return listItem;
};

const findItemIndex = (event, listItem) => {
  let window = event.target.closest(".task");
  let name = window.querySelector(".task__name").textContent;
  let desc = window.querySelector(".task__desc").textContent;

  let index = listItem.findIndex(
    (item) => item.name === name && item.desc === desc
  );
  return index;
};

const deleteItem = (event, deleteCard, listItem, index, deletedList) => {
  let currentCard = event.target.closest(".card").id;

  let tempListItem = listItem.splice(index, 1);
  deletedList.push(tempListItem.pop());

  drawCard(deleteCard, deletedList);
  drawCard(`#${currentCard}`, listItem);
};

app();
