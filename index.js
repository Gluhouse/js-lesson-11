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

  document.addEventListener("click", (event) => {
    if (event.target.closest(".card")) {
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

      if (event.target.closest(".btn__")) {
      }
    }
    console.log(list);
  });

  darkerPage.addEventListener("click", (event) => {
    closeWindow(event, "#addWindow");
    closeWindow(event, "#editWindow");
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

  console.log(cardName, listItem);

  if (windowName === "#addWindow") {
    inputName.value = "";
    inputDesc.value = "";

    confirmBtn.addEventListener("click", (event) => {
      confirmInput(event, listItem, false, 0, cardName);
    });
  } else if (windowName === "#editWindow") {
    inputName.value = listItem[index].name;
    inputDesc.value = listItem[index].desc;

    confirmBtn.addEventListener("click", (event) => {
      confirmInput(event, listItem, true, index, cardName);
    });
  }
};

const closeWindow = (event, windowName) => {
  event.preventDefault();
  document.querySelector(windowName).style.display = "none";
  document.querySelector(".darker").style.display = "none";
};

const confirmInput = (event, listItem, isEdit = false, index, cardName) => {
  event.preventDefault();
  debugger;
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

  console.log(cardName);

  if (cardName === "#toDoCard") {
    listItem.forEach((elem) => {
      tasks.innerHTML += `
          <div class="task">
          <h2 class="task__name">${elem.name}</h2>
          <button class="btn__progress"></button>
          <button class="btn__edit"></button>
          <button class="btn__delete"></button>
          <p class="task__desc">${elem.desc}</p>
        </div>`;
    });
  } else if (cardName === "#inProgressCard") {
    listItem.forEach((elem) => {
      tasks.innerHTML += `
        <div class="task">
        <h2 class="task__name">${elem.name}</h2>
        <button class="btn__progress"></button>
        <button class="btn__delete"></button>
        <p class="task__desc">${elem.desc}</p>
      </div>`;
    });
  } else {
    listItem.forEach((elem) => {
      tasks.innerHTML += `
        <div class="task">
        <h2 class="task__name">${elem.name}</h2>
        <p class="task__desc">${elem.desc}</p>
        <span class="lime">COMPLETED</span>
      </div>`;
    });
  }
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

  console.log(currentCardName);
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

app();
