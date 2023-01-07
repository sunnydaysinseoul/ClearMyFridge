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
let fridgeList = [];
let freezerList = [];
let nonPeriList = [];

const FRIDGELIST_KEY = "fridgeList";
const FREEZERLIST_KEY = "freezerList";
const nonPERILIST_KEY = "nonPeriList";

//***** Functions


//***** Initial Condition check

//***** Event Listener
