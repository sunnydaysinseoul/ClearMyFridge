const basicDiv = document.querySelector(".basic-ingredient #basic-form");
const editBtn = document.querySelector(".basic-ingredient #edit-btn");
const basicForm =  document.querySelector(".basic-ingredient form");
const basicTextarea = document.querySelector(".basic-ingredient form textarea");

let basicIngredient = [];
const BASICLIST_KEY = "basicIngredient";

//화면에 그리기
const drawForm = (e) =>{
    const divText = basicDiv.querySelector("div");
    divText.innerHTML = basicIngredient;
}

const saveForm = (e) =>{
    e.preventDefault();
    basicIngredient = basicTextarea.value;
    localStorage.setItem(BASICLIST_KEY, basicIngredient);

    basicDiv.classList.remove("hidden");
    basicForm.classList.add("hidden");
    drawForm();
}

const editForm = (e) =>{
    basicTextarea.value = basicIngredient;
    
    basicDiv.classList.add("hidden");
    basicForm.classList.remove("hidden");
}

//***** Initial Condition check
const savedBasicObj = localStorage.getItem(BASICLIST_KEY);
if (savedBasicObj !== null) {
    basicIngredient = savedBasicObj;
    basicDiv.classList.remove("hidden");
    basicForm.classList.add("hidden");
    drawForm();
}else{
    basicDiv.classList.add("hidden");
    basicForm.classList.remove("hidden");
}


//***** Event Listener
editBtn.addEventListener("click",editForm);
basicForm.addEventListener("submit",saveForm);