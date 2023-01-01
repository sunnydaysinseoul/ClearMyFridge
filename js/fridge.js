//***** Selectors
const fridgeForm = document.getElementById("fridge-form");
const fridgeInput = document.querySelector("#fridge-form input");
const fridgeList = document.querySelector("#fridge-form ul");

const freezerForm = document.getElementById("freezer-form");
const freezerInput = document.querySelector("#freezer-form input");
const freezerList = document.querySelector("#freezer-form ul");

const nonPerishableForm = document.getElementById("nonPerishable-form");
const nonPerishableInput = document.querySelector("#nonPerishable-form input");
const nonPerishableList = document.querySelector("#nonPerishable-form ul");

//***** Variables
let foodListObj = [];
const FOODLIST_KEY = "foodListObj";
let draggedData;
let dropType;
//***** Functions
const saveNewFood = (newFood, type) => {
  // 1.LocalStorage에 저장하기
  foodListObj.push(newFood); //array에 push

  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj)); //localstorage에는 array를 저장하지 못하므로 string형태로 변형후 저장.

  // 2.화면에 그리기
  drawList(newFood);
};

const deleteList = (e) => {
  const li = e.target.parentElement;
  foodListObj = foodListObj.filter((item) => item.id !== parseInt(li.id));
  //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj));

  li.remove(); //화면에서 바로 지우는 용도
};
const onDragStart = (e) => {
  const dragId = e.target.id;
  draggedData = foodListObj.find((item) => item.id == dragId);
  //배열에서 drag할 데이터 찾아두기.
  //onDropList 함수에서 사용함.
};

const onDropList = (e) => {
  e.preventDefault();
  const dropTarget = e.target.tagName; //drop시 떨어지는 target의 태그종류(DIV ,LI...)
  if (dropTarget == "DIV") {
    dropType = e.target.id; //drop되는 div의 이름(=type)
  } else {
    dropType = e.target.closest("div").id; //drop되는 개체의 가장 가까운 parent div요소의 id(=type)
  }

  const newFoodListObj = foodListObj.map((item) => {
    if (item.id == draggedData.id) {
      item.type = dropType; //drop된 데이터와 같은 데이터를 Obj에서 찾아서 변경.
      return item;
    }
    return item;
  });

  localStorage.setItem(FOODLIST_KEY, JSON.stringify(newFoodListObj));
  
//   newFoodListObj.forEach((item) => drawList(item)); //화면에 다시그려주기
};
const drawList = (newFood) => {
  //화면에 리스트 그려주는 용도
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("i");
  li.append(span);
  li.append(delBtn);

  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.draggable = "true";
  li.classList.add("flex-row", "dragList");
  li.addEventListener("dragstart", onDragStart);
  span.innerText = newFood.name;
  delBtn.classList.add("fa-solid", "fa-delete-left", "delBtn");
  delBtn.addEventListener("click", deleteList);

  if (newFood.type == "fridge-form") {
    fridgeList.append(li);
  } else if (newFood.type == "freezer-form") {
    freezerList.append(li);
  } else if (newFood.type == "nonPerishable-form") {
    nonPerishableList.append(li);
  }
};

const onFoodSubmit = (e, type) => {
  e.preventDefault();
  let foodValue;
  if (type == "fridge-form") {
    foodValue = fridgeInput.value;
    console.log(fridgeInput);
    fridgeInput.value = "";
  } else if (type == "freezer-form") {
    foodValue = freezerInput.value;
    freezerInput.value = "";
  } else if (type == "nonPerishable-form") {
    foodValue = nonPerishableInput.value;
    nonPerishableInput.value = "";
  }

  const newFood = {
    name: foodValue,
    id: Date.now(),
    type: type,
  };
  saveNewFood(newFood);
};

//***** Condition check

//실행시 localStorage 값 여부 체크.
const savedfoodListObj = localStorage.getItem(FOODLIST_KEY);

if (savedfoodListObj !== null) {
  const parsedFoodListObj = JSON.parse(savedfoodListObj);
  parsedFoodListObj.forEach((item) => drawList(item)); //저장된 값 화면에 그려주기
  foodListObj = parsedFoodListObj; //시작시 빈Obj로 지정하니 값이 있는경우 덮어씌워줌.
}

//***** Event Listener
fridgeForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "fridge-form");
});
fridgeForm.addEventListener("dragover", (e) => {
  e.preventDefault();
});
fridgeForm.addEventListener("drop", onDropList);

freezerForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "freezer-form");
});
freezerForm.addEventListener("dragover", (e) => {
  e.preventDefault();
});
freezerForm.addEventListener("drop", onDropList);

nonPerishableForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "nonPerishable-form");
});
nonPerishableForm.addEventListener("dragover", (e) => {
  e.preventDefault();
});
nonPerishableForm.addEventListener("drop", onDropList);
