var i = 1,
  time = 0;
var elem;
let bet_array = [
  { name: "fheart", bet: 0, index: [4], index_m: [], win: 100 },
  { name: "train", bet: 0, index: [3, 5], index_m: [3], win: 100, win_m: 50 },
  { name: "heart", bet: 0, index: [2, 6, 10, 16, 22], index_m: [], win: 30 },
  { name: "cherry", bet: 0, index: [11], index_m: [], win: 30 },
  {
    name: "strawberry",
    bet: 0,
    index: [20, 21],
    index_m: [21],
    win: 20,
    win_m: 4,
  },
  {
    name: "watermelon",
    bet: 0,
    index: [15, 17],
    index_m: [15],
    win: 20,
    win_m: 4,
  },
  { name: "pear", bet: 0, index: [8, 9], index_m: [9], win: 20, win_m: 4 },
  {
    name: "pineapple",
    bet: 0,
    index: [1, 12, 13],
    index_m: [12],
    win: 10,
    win_m: 2,
  },
  {
    name: "lemon",
    bet: 0,
    index: [7, 18, 19],
    index_m: [18],
    win: 10,
    win_m: 2,
  },
  {
    name: "apple",
    bet: 0,
    index: [14, 23, 24],
    index_m: [24],
    win: 10,
    win_m: 2,
  },
];

let CREDITOS = 0;
let PREMIO = 0;
let BONUS = 0;
let HEART_BONUS = 0;
let USER = "";

speed = function (rnd, it, time) {
  var sinu = 1500 * Math.sin(((time * 25 + it) * Math.PI) / rnd);
  if (sinu > 370) {
    sinu = 370;
  }
  return Math.floor(400 - sinu);
};

async function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function run() {
  let myrand = Math.random() * 200 + 100;
  while (true) {
    var aux_index = i - 1;
    if (aux_index <= 0) {
      aux_index = 24 + aux_index;
    }
    elem = document.getElementById("_" + aux_index);
    for (let child of elem.children) {
      if (child.classList.contains("bl_sq")) {
        elem.removeChild(child);
      }
    }
    elem = document.getElementById("_" + i);
    var a = document.createElement("div");
    a.classList.add("bl_sq");
    elem.appendChild(a);
    i++;
    if (i == 25) {
      i = (i % 25) + 1;
      time++;
    }
    let spd = speed(myrand, i, time);
    if (time * 25 + i > myrand) {
      time = 0;
      i--;
      if (i == 0) {
        i = 24;
      }
      return;
    }
    let delayres = await delay(spd);
    // console.log(delayres);
  }
}

async function play(btn) {
  // CHECK IF BET IS MADE
  var sum = bet_array.reduce((a, b) => a + b.bet, 0);
  if (sum == 0) {
    return;
  }

  // CLEAR ELEM
  if (elem) {
    for (let child of elem.children) {
      if (child.classList.contains("bl_sq")) {
        elem.removeChild(child);
      }
    }
  }

  // RANDOM CHOOSE AND ANIMATION
  btn.style.transform = "translateY(100%)";
  await run();
  btn.style.transform = "translateY(0%)";
  child = elem.lastElementChild;
  //   child.style.animationPlayState = "paused";
  child.style.animationName = "blink_low";

  // CHECK IF WIN
  console.log("CASILLA GANADORA:: " + i);
  bet_array.forEach((element) => {
    if (element.index.includes(i) && element.bet > 0) {
      console.log("FRUTA GANADORA:: " + element.name);
      if (element.index_m.includes(i)) {
        PREMIO += element.win_m * element.bet;
      } else {
        PREMIO += element.win * element.bet;
      }
      console.log("PREMIO:: " + PREMIO);
      document.getElementById("premio_val").innerHTML = PREMIO;
    }
  });

  // EMPTY BETS
  bet_array.forEach((element) => {
    element.bet = 0;
    var mybtn = document.getElementById(element.name + "_sel");
    mybtn.innerHTML = "";
    mybtn.style.backgroundPositionY = "50%";
  });
}

function choose(btn, name) {
  if (CREDITOS > 0) {
    CREDITOS--;
    btn.style.backgroundPositionY = "10%";
    let obj = bet_array.find((o) => o.name == name);
    obj.bet += 1;
    btn.innerHTML = "<p>x" + obj.bet + "</p>";
    document.getElementById("credito_val").innerHTML = CREDITOS;
  }
  // console.log(name);
}

function pass_prize() {
  CREDITOS += PREMIO;
  PREMIO = 0;
  document.getElementById("premio_val").innerHTML = PREMIO;
  document.getElementById("credito_val").innerHTML = CREDITOS;
}

function getParams(url) {
  var idx = url.indexOf("?");
  var params = new Array();
  if (idx != -1) {
    var pairs = url.substring(idx + 1, url.length).split("&");
    for (var i = 0; i < pairs.length; i++) {
      nameVal = pairs[i].split("=");
      params[nameVal[0]] = nameVal[1];
    }
  }
  return params;
}

params = getParams(document.URL);
USER = params["user"];
CREDITOS = parseInt(params["credito"]);
PREMIO = parseInt(params["premio"]);
BONUS = parseInt(params["bonus"]);
HEART_BONUS = parseInt(params["hbonus"]);
HEART_DONE = JSON.parse(params["hdone"]);

document.getElementById("premio_val").innerHTML = PREMIO;
document.getElementById("credito_val").innerHTML = CREDITOS;
document.getElementById("full_bonus_id").innerHTML = BONUS;
document.getElementById("heart_bonus_id").innerHTML = HEART_BONUS;

for(let idx of HEART_DONE) {
  var myel = document.getElementByID("_"+idx);
  var hel = document.getElementByID("h_"+idx);
  myel.classList.add("bonus_h");
  hel.style.filter = "";
}
