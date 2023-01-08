const basicDiv = document.querySelector(".basic-ingredient #basic-form");
const editRecommend = document.querySelector(".basic-ingredient #edit-recommend");
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

const onRecommendCopy = (e)=>{
    const copyText = `<b>🥫소스/장류 (냉장)</b>
<br>케찹 / 마요네즈 / 고추장 / 된장
<br>
<br><b>🥫소스/장류 (상온)</b>
<br>
<br><b>🥤음료류</b>
<br>`;
    window.navigator.clipboard.writeText(copyText);
    const getParent = e.target.closest("form");
    const copyAlert = document.createElement("span");
    copyAlert.innerText = "클립보드에 복사되었습니다.";
    copyAlert.style = "margin : 0 0 0 auto;";
    getParent.append(copyAlert);
 
    setTimeout(()=>{copyAlert.remove()},2000);
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
editRecommend.addEventListener("click",onRecommendCopy);