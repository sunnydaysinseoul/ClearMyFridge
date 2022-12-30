const loginInput = document.querySelector("#login-form input");
const loginButton = document.querySelector("#login-form button");

const handleLoginButton = () =>{
    console.log("click");
    console.dir(loginInput); //loginInput에 어떤 property를 사용할 수 있는지
    console.log(loginInput.value);

}


loginButton.addEventListener("click",handleLoginButton);