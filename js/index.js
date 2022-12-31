//***** Selectors
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

//***** Variables
const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

//***** Functions
const paintGreetings = (username) => {
  greeting.innerText = `Hello, ${username}!`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
};

const onLoginSubmit = (e) => {
  e.preventDefault();
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  loginForm.classList.add(HIDDEN_CLASSNAME);
  paintGreetings(username);
};


//***** Condition check
const hasUsername = localStorage.getItem(USERNAME_KEY);
if (hasUsername) {
  paintGreetings(hasUsername);
} else {
  loginForm.classList.remove(HIDDEN_CLASSNAME);
}


//***** Event Listener
loginForm.addEventListener("submit", onLoginSubmit);
