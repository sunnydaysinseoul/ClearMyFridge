const API_KEY = "5ec76f143217881ba2e66dbcf2bf1849"; //https://home.openweathermap.org/에서 받은 API key
const COORDS = "coords";
const weather = document.querySelector("#weather");

//자바스크립트가 좋은 이유! 페이지를 전체 새로고침하지 않고도 데이터를 가져올 수 있음!!

function getWeather(lat,lng){
  fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`)
  //잘 가져왔는지 확인 : 브라우저F12-Network-weather blahblah-Headers-Request URL
  .then(function(response){ // then : 데이터가 서버로부터 완전히 fetch된 다음에~ 함수를 출력하겠다
        return response.json()
      })
      .then(function(json){ //then을 중첩사용!! fetch가 됐는지 기다리고, 그 response가 왔는지 기다리고, 다되면 JSON을 출력해라!
        // console.log(json)
        const temparature = json.main.temp;
        const place = json.name;
        const weatherDes = json.weather[0].description;
        const weatherIconNm = json.weather[0].icon;
        const weatherIconImg = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weatherIconNm}.svg`;
        weather.innerHTML = `${place} : ${temparature}℃  <img class="city-icon" src="${weatherIconImg}" alt="${weatherDes}">`;

      })
}

function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
  //사용자 현재 좌표를 다른 함수들을 통해 가져와서 handleGeoSuccess()를 통해
  //      Object로 저장한 다음, 다시 string화 해서 local storage에 저장하기.
}

function handleGeoSuccess(position) { //askForCoords의 getCurrentPosition()에 필요한 값1
  //위도와 경도를 API를 통해 불러와서 Object로 저장하기
  // console.log(position)
  const latitude = position.coords.latitude; //현재위치의 위도값만 저장
  const longitude = position.coords.longitude; //현재위치의 경도값만 저장
  const coordsObj = {
    latitude, // latitude = latitude (위에 정의해준거랑 같은이름의 key를 지정하기)
    longitude, // longitude = longitude (Object의 value값도 위에 정의한 이름을 그대로 지정)
  };
  saveCoords(coordsObj); //현재위치의 [위도,경도] Object를 saveCoords()함수에 입력
  getWeather(latitude,longitude); //getWeather함수에 현재위치의 위도,경도를 입력(API에서 날씨 fetch하기 위함.)
}

function handleGeoError() { //askForCoords의 getCurrentPosition()에 필요한 값2
  console.log("Failed to get Geo!");
}

function askForCoords() {
  //navigator의 API를 사용할 것!
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError); //현재위치정보 받아오기
} 

function loadCoords() {
               //Coords : 좌표
  const loadedCoords = localStorage.getItem(COORDS); //askForCoords를 통해 가져와서 saveCoords를 통해 localStorage에 저장한 위치 좌표값 가져오기.
  if (loadedCoords === null) {
    askForCoords();
  } else { //가져온 좌표값이 있으면 stinrg -> object으로 변환해주고 원하는 값 가져와서 getWeather에 넣고 실행.
    const parseCoords = JSON.parse(loadedCoords);
    getWeather(parseCoords.latitude,parseCoords.longitude);
  }
}

function init() {
  loadCoords();
}

init();