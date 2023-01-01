const menus = [
    {
        name : "버거",
        image : "/img/burger.jpg",
    },
    {
        name : "볶음면",
        image : "/img/friednoodles.jpg",
    },
    {
        name : "팬케익",
        image : "/img/pancakes.jpg",
    },
    {
        name : "샌드위치",
        image : "/img/sandwich.jpg",
    },
    {
        name : "요거트볼",
        image : "/img/yogurtbowl.jpg",
    },
];

const menuname = document.querySelector("#menuidea span");
const menupic = document.querySelector("#menuidea img");

const menuidea = menus[Math.floor(Math.random()*menus.length)];

console.log(menuidea);

menuname.innerText = menuidea.name;
menupic.src = menuidea.image;