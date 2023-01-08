const clock = document.querySelector("h4#clock");

function getClock() {
  const date = new Date();
  const hourNow = String(date.getHours()).padStart(2, 0);
  const minNow = String(date.getMinutes()).padStart(2, 0);
  const secNow = String(date.getSeconds()).padStart(2, 0);
  const dateNow = `${hourNow}:${minNow}:${secNow}`;

  // console.log(dateNow);
  clock.innerText = dateNow;
}

getClock();
setInterval(getClock, 1000);
