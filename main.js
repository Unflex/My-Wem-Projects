const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div"),
  audio = document.querySelector(".audio"),
  records = document.querySelector(".records"),
  dtp = document.querySelector(".dtp");

let person;

game = document.querySelector(".game");
table_records = document.querySelector(".table_records");

car.classList.add("car");
start.addEventListener("click", complexity);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function complexity() {
  start.classList.add("hide");
  const light = document.createElement("div"),
    medium = document.createElement("div"),
    hard = document.createElement("div");
  light.textContent = "light";
  medium.textContent = "medium";
  hard.textContent = "hard";

  light.classList.add("light");
  medium.classList.add("medium");
  hard.classList.add("hard");
  light.addEventListener("click", function () {
    setting.traffic = 3;
    setting.speed = 3;
    startGame();
    light.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
  });
  medium.addEventListener("click", function () {
    setting.traffic = 2;
    setting.speed = 6;
    startGame();
    light.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
  });
  hard.addEventListener("click", function () {
    setting.traffic = 1;
    setting.speed = 9;
    startGame();
    light.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
  });
  game.appendChild(light);
  game.appendChild(medium);
  game.appendChild(hard);
}

function startGame() {
  table_records.classList.remove("hide");
  gameArea.innerHTML = "";

  gameArea.style.display = "block";
  score.style.display = "block";
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = i * 100 + "px";
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      "transparent url('./image/car3.png') center / cover no-repeat";
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = "auto";
  car.style.bottom = "10px";
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    audio.play();
    setting.score += setting.speed;
    score.textContent = setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }
    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;

      score.style.display = "none";
      gameArea.style.display = "none";
      audio.pause();
      dtp.play();
      start.classList.remove("hide");
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + "px";
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
  if (setting.start === false) {
    if (setting.score > 2000) {
      table_records.classList.add("hide");
      setTimeout(function () {
        person = prompt("Please enter your name", "noname");
        while (person === null) {
          person = prompt("Please enter your name", "noname");
        }
        localStorage.setItem(person, setting.score);
        record = document.createElement("div");
        record.classList.add("line_score");
        record.textContent = person + "     " + localStorage.getItem(person);
        records.appendChild(record);
      }, 500);
    }
  }
}
