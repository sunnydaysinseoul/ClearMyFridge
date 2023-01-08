//***** Selectors
const fridgeForm = document.getElementById("fridge-form");
const fridgeList = document.querySelector("#fridge-form ul");

const freezerForm = document.getElementById("freezer-form");
const freezerList = document.querySelector("#freezer-form ul");

const nonPerishableForm = document.getElementById("nonPerishable-form");
const nonPerishableList = document.querySelector("#nonPerishable-form ul");

const inputForms = document.querySelectorAll(".input-form");

//***** Variables
let fridgeObj = [];
let freezerObj = [];
let nonPeriObj = [];
let startLi;
let chkObj;
const FRIDGEOBJ_KEY = "fridgeObj";
const FREEZEROBJ_KEY = "freezerObj";
const NONPERIOBJ_KEY = "nonPeriObj";

//***** Functions
const fromWhatObj = (li) =>{
  //클릭한 li가 어떤 Obj에 있는지 찾아서 지우기.
  const chkFridgeObj = fridgeObj.filter((item) => item.id == parseInt(li.id));
  const chkFreezerObj = freezerObj.filter((item) => item.id == parseInt(li.id));
  const chkNonPeriObj = nonPeriObj.filter((item) => item.id == parseInt(li.id));
  
  if(chkFridgeObj.length>0){
    chkObj = FRIDGEOBJ_KEY;
  }
  if(chkFreezerObj.length>0){
    chkObj = FREEZEROBJ_KEY;
  }
  if(chkNonPeriObj.length>0){
    chkObj = NONPERIOBJ_KEY;
  }
  return chkObj;
}
function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const dragStart=(e)=>{
  startLi = e.target.closest('li');
  e.dataTransfer.setData("id",e.target.id);
}
const dragEnter=(e)=>{
  e.target.classList.add('over');
}
const dragOver=(e)=>{
  e.preventDefault();
}
const dragLeave=(e)=>{
  e.target.classList.remove('over');
}
const dragDrop=(e)=>{
  const dropLi = e.target.closest('li');
  insertAfter(startLi,dropLi);
  
  const thisObj = fromWhatObj(startLi);
  const startId = e.dataTransfer.getData("id");
  const dropId = e.target.closest('li').getAttribute('id');
  
  console.log(startId,dropId);
  if(thisObj == FRIDGEOBJ_KEY){
    console.log(fridgeObj);
    const resultMap = fridgeObj.map((item)=>{
      item.id == dropId ?
      console.log('aaaa')
      :(
      item.id = startId ?
      console.log('bbbb') :
      console.log('cccc'))})
      
    console.log(resultMap);
  }else if(thisObj = FREEZEROBJ_KEY){

  }else if(thisObj = NONPERIOBJ_KEY){

  }

}

const addEventListeners=()=>{
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}


const deleteList = (e) => {
  const li = e.target.parentElement;
  
  //클릭한 li가 어떤 Obj에 있는지 찾아서 지우기.
  fromWhatObj(li);
  
  if(chkObj = FRIDGEOBJ_KEY){
    fridgeObj=fridgeObj.filter((item) => item.id !== parseInt(li.id));
    localStorage.setItem(FRIDGEOBJ_KEY, JSON.stringify(fridgeObj));
  }
  if(chkObj = FREEZEROBJ_KEY){
    freezerObj=freezerObj.filter((item) => item.id !== parseInt(li.id));
    localStorage.setItem(FREEZEROBJ_KEY, JSON.stringify(freezerObj));
  }
  if(chkObj = NONPERIOBJ_KEY){
    nonPeriObj=nonPeriObj.filter((item) => item.id !== parseInt(li.id));
    localStorage.setItem(NONPERIOBJ_KEY, JSON.stringify(nonPeriObj));
  }
  //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서

  li.remove(); //화면에서 바로 지우는 용도
};

const drawList = (newFood,type) => {
  //화면에 리스트 그려주는 용도
  let li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("i");
  // li.setAttribute('data-index', index);
  li.append(span);
  li.append(delBtn);

  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.draggable = "true";
  li.classList.add("flex-row", "draggable");
  
  span.innerText = newFood.name;
  delBtn.classList.add("delBtn");
  delBtn.addEventListener("click", deleteList);

  if (type == FRIDGEOBJ_KEY) {
    fridgeList.append(li);
  } else if (type == FREEZEROBJ_KEY) {
    freezerList.append(li);
  } else if (type == NONPERIOBJ_KEY) {
    nonPerishableList.append(li);
  }

  addEventListeners();
};


const saveList = (newFood,type) => {
  // 1.LocalStorage에 저장하기
  if (type == FRIDGEOBJ_KEY) {
    fridgeObj.push(newFood);
    localStorage.setItem(FRIDGEOBJ_KEY, JSON.stringify(fridgeObj));
  } else if (type == FREEZEROBJ_KEY) {
    freezerObj.push(newFood);
    localStorage.setItem(FREEZEROBJ_KEY, JSON.stringify(freezerObj));
  } else if (type == NONPERIOBJ_KEY) {
    nonPeriObj.push(newFood);
    localStorage.setItem(NONPERIOBJ_KEY, JSON.stringify(nonPeriObj));
  }
  
  // 2.화면에 그리기
  drawList(newFood,type);
};

const onFoodSubmit = (e, type) => {
  e.preventDefault();
  let foodValue;
  if (type == FRIDGEOBJ_KEY) {
    foodValue = e.target["fridgeInput"].value;
    e.target["fridgeInput"].value = "";
  } else if (type == FREEZEROBJ_KEY) {
    foodValue = e.target["freezerInput"].value;
    e.target["freezerInput"].value = "";
  } else if (type == NONPERIOBJ_KEY) {
    foodValue = e.target["nonPeriInput"].value;
    e.target["nonPeriInput"].value = "";
  }

  // LocalStorage에 저장될 데이터 형태!
  const newFood = {
    name: foodValue,
    id: Date.now(),
  };
  saveList(newFood,type);
};

//***** Initial Condition check
//실행시 localStorage 값 여부 체크.
const savedFRIDGEOBJ = localStorage.getItem(FRIDGEOBJ_KEY);
const savedFREEZEROBJ = localStorage.getItem(FREEZEROBJ_KEY);
const savedNONPERIOBJ = localStorage.getItem(NONPERIOBJ_KEY);


if (savedFRIDGEOBJ !== null) {
  let parsedObj = JSON.parse(savedFRIDGEOBJ);
  parsedObj.forEach((item) => drawList(item,FRIDGEOBJ_KEY)); //저장된 값 화면에 그려주기
  parsedObj = parsedObj.sort((prev, cur) => {
    return prev.id - cur.id;
  });

  fridgeObj = parsedObj; //시작시 빈Obj로 지정하니 값이 있는경우 덮어씌워줌.
}
if(savedFREEZEROBJ !== null) {
  let parsedObj = JSON.parse(savedFREEZEROBJ);
  parsedObj.forEach((item) => drawList(item,FREEZEROBJ_KEY));
  parsedObj = parsedObj.sort((prev, cur) => {
    return prev.id - cur.id;
  });
  freezerObj = parsedObj; 
}
if(savedNONPERIOBJ!== null){
  let parsedObj = JSON.parse(savedNONPERIOBJ);
  parsedObj.forEach((item) => drawList(item,NONPERIOBJ_KEY));
  parsedObj = parsedObj.sort((prev, cur) => {
    return prev.id - cur.id;
  });
  nonPeriObj = parsedObj; 
}

//***** Event Listener
fridgeForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, FRIDGEOBJ_KEY);
});

freezerForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, FREEZEROBJ_KEY);
});

nonPerishableForm.addEventListener("submit", (e) => {
  onFoodSubmit(e, NONPERIOBJ_KEY);
});