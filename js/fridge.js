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
  console.log(li);
  foodListObj = foodListObj.filter((item) => item.id !== parseInt(li.id));
  //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj));

  li.remove(); //화면에서 바로 지우는 용도
};

const drawList = (newFood) => {
  //화면에 리스트 그려주는 용도
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("i");
  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.classList.add("flex-row");
  li.append(span);
  li.append(delBtn);
  span.innerText = newFood.name;
  delBtn.classList.add("fa-solid","fa-delete-left","delBtn");
  delBtn.addEventListener("click", deleteList);

  if (newFood.type == "fridge") {
    fridgeList.append(li);
  } else if (newFood.type == "freezer") {
    freezerList.append(li);
  } else if (newFood.type == "nonPerishable") {
    nonPerishableList.append(li);
  }
};

const onFoodSubmit = (e, type) => {
  e.preventDefault();
  let foodValue;
  if(type=="fridge"){
    foodValue = fridgeInput.value;
  fridgeInput.value = "";
  }else if(type=="freezer"){
    foodValue = freezerInput.value;
    freezerInput.value = "";
  }else if(type=="nonPerishable"){
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
  parsedFoodListObj.forEach((item) => drawList(item, FOODLIST_KEY)); //저장된 값 화면에 그려주기
  foodListObj = parsedFoodListObj;
}

//***** Event Listener
fridgeForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "fridge");
});
freezerForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "freezer");
});
nonPerishableForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "nonPerishable");
});
