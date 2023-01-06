//***** Selectors
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");
const menuname = document.querySelector("#menuidea span");
const menupic = document.querySelector("#menuidea img");

const menus = [
  {
      name : "버거",
      image : "../img/burger.jpg",
  },
  {
      name : "볶음면",
      image : "../img/friednoodles.jpg",
  },
  {
      name : "팬케익",
      image : "../img/pancakes.jpg",
  },
  {
      name : "샌드위치",
      image : "../img/sandwich.jpg",
  },
  {
      name : "요거트볼",
      image : "../img/yogurtbowl.jpg",
  },
];
const menuidea = menus[Math.floor(Math.random()*menus.length)];
menupic.src = menuidea.image;

//***** Variables
const HIDDEN_CLASSNAME = "hidden";
const SHOW_CLASSNAME = "show";
const USERNAME_KEY = "username";

//***** Functions
const paintGreetings = (username) => {
  const menuname = document.querySelector("#menuidea span");
  greeting.innerHTML = `안녕하세요, <b>${username}</b>님! `;
  menuname.innerHTML = ` 오늘은<br><i><b>${menuidea.name}</b></i><br>어떠세요?`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
  greeting.classList.add(SHOW_CLASSNAME);

};

const onLoginSubmit = (e) => {
  e.preventDefault();
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  loginForm.classList.remove(SHOW_CLASSNAME);
  loginForm.classList.add(HIDDEN_CLASSNAME);
  paintGreetings(username);
};


//***** Condition check
const hasUsername = localStorage.getItem(USERNAME_KEY);
if (hasUsername) {
  loginForm.classList.add(HIDDEN_CLASSNAME);
  paintGreetings(hasUsername);
} else {
  // greeting.classList.add(HIDDEN_CLASSNAME);
}


//***** Event Listener
loginForm.addEventListener("submit", onLoginSubmit);
