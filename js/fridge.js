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

const inputForms = document.querySelectorAll(".input-form");

//***** Variables
let foodListObj = [];
const FOODLIST_KEY = "foodListObj";
let dragStartLi = "";
let draggedData = "";
let dropType = "a";
let dragEndDiv = "";
//***** Functions
const saveList = (newFood) => {
  // 1.LocalStorage에 저장하기
  foodListObj.push(newFood); //array에 push
  foodListObj = foodListObj.sort((prev, cur) => {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj)); //localstorage에는 array를 저장하지 못하므로 string형태로 변형후 저장.

  // 2.화면에 그리기
  drawList(newFood);
};

const deleteList = (e) => {
  const li = e.target.parentElement;
  foodListObj = foodListObj.filter((item) => item.id !== parseInt(li.id));
  foodListObj = foodListObj.sort((prev, cur) => {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj));

  li.remove(); //화면에서 바로 지우는 용도
};

//// Drag Events
const onDragStart = (e) => {
  const dragId = e.target.id;
  dragStartLi = e.target; //Drop되면 해당 Li지워주려고 저장.
  draggedData = foodListObj.find((item) => item.id == dragId);
  //배열에서 drag할 데이터 찾아두기.
  //onDrop 함수에서 사용함.
};
const onDragOver = (e) => {
  e.preventDefault();
  // const thisDiv = e.target.closest("div");
  // thisDiv.classList.add("drag-over");

  e.target.classList.add("drag-over");
};
const onDragLeave = (e) => {
  e.preventDefault();
  const hasClass = document.querySelectorAll(".drag-over");
  hasClass.forEach((item)=>{item.classList.remove("drag-over")});
};

const onDrop = (e) => {
  e.preventDefault();
  const hasClass = document.querySelectorAll(".drag-over");
  hasClass.forEach((item)=>{item.classList.remove("drag-over")});
  
  // const dropTarget = e.target.tagName; //drop시 떨어지는 target의 태그종류(DIV ,LI...)
  // if (dropTarget == "DIV") {
  //   dropType = e.target.id; //drop되는 div의 이름(=type)
  // } else {
  //   dropType = e.target.closest("div").id; //drop되는 개체의 가장 가까운 parent div요소의 id(=type)
  // }
  dropType = e.currentTarget.id; //e.target대신, 이벤트리스너를 가진 요소를 가리키도록 currentTarget으로 변경
  let newFoodListObj = foodListObj.map((item) => {
    if (item.id == draggedData.id) {
      item.type = dropType; //drop된 데이터와 같은 데이터만 Obj에서 찾아서 변경.
      item.id = Date.now(); //id를 현재 수정된 날짜로 변경. (sort위해)
           console.log(dragStartLi.compareDocumentPosition(e.target));
      dragStartLi.remove();
      drawList(draggedData); // 제대로된 곳에  drop되었을 때 - 드래그시작한 li를 새로운 곳에 draw해주고, 원래 리스트에선 remove.
      return item;
    }
    return item;
  });
  newFoodListObj = newFoodListObj.sort((prev, cur) => {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(newFoodListObj));

  const thisDiv = e.target.closest("div");
  thisDiv.classList.remove("drag-over");
};

const drawList = (newFood) => {
  //화면에 리스트 그려주는 용도
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("i");
  // li.setAttribute('data-index', index);
  li.append(span);
  li.append(delBtn);

  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.draggable = "true";
  li.classList.add("flex-row", "drag-list");
  li.addEventListener("dragstart", onDragStart);
  span.innerText = newFood.name;
  // delBtn.classList.add("fa-solid", "fa-delete-left", "delBtn");
  delBtn.classList.add("delBtn");
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
    fridgeInput.value = "";
  } else if (type == "freezer-form") {
    foodValue = freezerInput.value;
    freezerInput.value = "";
  } else if (type == "nonPerishable-form") {
    foodValue = nonPerishableInput.value;
    nonPerishableInput.value = "";
  }

  //LocalStorage에 저장될 데이터 형태!
  const newFood = {
    name: foodValue,
    id: Date.now(),
    type: type,
  };
  saveList(newFood);
};

//***** Initial Condition check

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

freezerForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "freezer-form");
});

nonPerishableForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, "nonPerishable-form");
});

inputForms.forEach((inputForm) => {
  inputForm.addEventListener("drop", onDrop);
});
inputForms.forEach((inputForm) => {
  inputForm.addEventListener("dragover", onDragOver);
});
inputForms.forEach((inputForm) => {
  inputForm.addEventListener("dragleave", onDragLeave);
});

/*참고:
window.addEventListener("storage",(e)=>console.log(e)); //-storage이벤트는, 같은 도메인의 다른 윈도우/탭/창에서 storage내용변경이 일어났을 때만 감지한다 ㅠㅠ
*/
