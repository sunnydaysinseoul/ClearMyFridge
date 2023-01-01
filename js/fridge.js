//***** Selectors
const foodForm = document.getElementById("food-form");
const foodInput = document.querySelector("#food-form input");
const foodList = document.getElementById("food-list");

//***** Variables
let fridgeFoods = [];
let freezerFoods = [];
let nonPerishableFoods = [];
const FRIDGE_KEY = "fridgeFoods";
const FREZZER_KEY = "freezerFoods";
const NONPERISHABLE_KEY = "nonPerishableFoods";

//***** Functions
const saveNewFood = (newFood) => {
    // 1.LocalStorage에 저장하기
  fridgeFoods.push(newFood); //array에 push
  
  localStorage.setItem(FRIDGE_KEY, JSON.stringify(fridgeFoods)); //localstorage에는 array를 저장하지 못하므로 string형태로 변형후 저장.

    // 2.화면에 그리기
    drawList(newFood);
};

const deleteList = (e) => {
  const li = e.target.parentElement;
  fridgeFoods = fridgeFoods.filter((item)=>item.id !== parseInt(li.id));
        //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서
  localStorage.setItem(FRIDGE_KEY, JSON.stringify(fridgeFoods));

  li.remove(); //화면에서 바로 지우는 용도
};

const drawList = (newFood) => { //화면에 리스트 그려주는 용도
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.append(span);
  li.append(delBtn);
  span.innerText = newFood.name;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteList);

  foodList.append(li);
};

const onFoodFormSubmit = (e) => {
  e.preventDefault();
  const foodValue = foodInput.value;
  foodInput.value = "";

  const newFood = {
    name : foodValue,
    id : Date.now(),
}

  saveNewFood(newFood);
};

//***** Condition check

//실행시 localStorage 값 여부 체크.
const savedFridgeFoods = localStorage.getItem(FRIDGE_KEY);
if (savedFridgeFoods !== null) {
  const parsedFridgeFoods = JSON.parse(savedFridgeFoods);
  parsedFridgeFoods.forEach(drawList); //저장된 값 화면에 그려주기
  fridgeFoods = parsedFridgeFoods;
}

//***** Event Listener
foodForm.addEventListener("submit", onFoodFormSubmit);
