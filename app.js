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
    win_m: 2,
  },
  {
    name: "watermelon",
    bet: 0,
    index: [15, 17],
    index_m: [15],
    win: 20,
    win_m: 2,
  },
  { name: "pear", bet: 0, index: [8, 9], index_m: [9], win: 20, win_m: 2 },
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

let probabilities = new Array(25).fill(0);

let CREDITOS = 10;
let PREMIO = 0;
let BONUS = 0;
let HEART_BONUS = 0;
let USER = "";
let HEART_DONE = [];
let dels = [];

function init_probabilities(array_prob) {
  // win < 5 -> 65%
  // win == 10 -> 15%
  // win == 20 -> 10%
  // win == 30 -> 5%
  // win_train_m == 3%
  // win_train_M == 1.5%
  // win_bonus == 0.5%
  var sum = array_prob.reduce((a, b) => a + b, 0);
  var p_none = 1 - sum;
  // if (sum != 1) {
  //   console.log("ERROR init probabilities::: must sum 1");
  //   return;
  // }
  min5 = [];
  eq10 = [];
  eq20 = [];
  eq30 = [];
  wtrain_m = 3;
  wtrain_M = 5;
  wbonus = 4;
  for (let fig of bet_array) {
    if (fig.win_m && fig.win_m < 5) {
      for (let minfig of fig.index_m) {
        min5.push(minfig);
      }
    }
    if (fig.win == 10) {
      for (let Mfig of fig.index) {
        if (!fig.index_m.includes(Mfig)) {
          eq10.push(Mfig);
        }
      }
    }
    if (fig.win == 20) {
      for (let Mfig of fig.index) {
        if (!fig.index_m.includes(Mfig)) {
          eq20.push(Mfig);
        }
      }
    }
    if (fig.win == 30) {
      for (let Mfig of fig.index) {
        if (!fig.index_m.includes(Mfig)) {
          eq30.push(Mfig);
        }
      }
    }
  }

  let nochoose = [];
  for (let elm of bet_array) {
    if (elm.bet == 0) {
      for (let id of elm.index) {
        nochoose.push(id);
      }
    }
  }
  // console.log("NOchoose");
  // console.log(nochoose);
  // console.log(p_none);

  for (let idx_b = 1; idx_b < 25; idx_b++) {
    probabilities[idx_b] = probabilities[idx_b - 1];
    if (nochoose.includes(idx_b)) {
      probabilities[idx_b] += p_none / nochoose.length;
    }
    if (min5.includes(idx_b)) {
      if(nochoose.length == 0){
        probabilities[idx_b] += (array_prob[0]+p_none) / min5.length;
      } else {
        probabilities[idx_b] += array_prob[0] / min5.length;
      }
    } else if (eq10.includes(idx_b)) {
      probabilities[idx_b] += array_prob[1] / eq10.length;
    } else if (eq20.includes(idx_b)) {
      probabilities[idx_b] += array_prob[2] / eq20.length;
    } else if (eq30.includes(idx_b)) {
      probabilities[idx_b] += array_prob[3] / eq30.length;
    } else if (idx_b == wtrain_m) {
      probabilities[idx_b] += array_prob[4];
    } else if (idx_b == wtrain_M) {
      probabilities[idx_b] += array_prob[5];
    } else if (idx_b == wbonus) {
      probabilities[idx_b] += array_prob[6];
    }
  }
  // console.log(probabilities);
}

speed = function (rnd, iters) {
  var sinu = 1500 * Math.sin((iters * Math.PI) / rnd);
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

async function run(classname, dir, llim, rlim) {
  // let myrand = Math.random() * (rlim - llim) + llim;
  init_probabilities([0.43, 0.0045, 0.003, 0.001, 0.0004, 0.0002, 0.0001]);
  let ran_cell = Math.random();
  // console.log("RANDOM :=");
  // console.log(ran_cell);
  // console.log(i);
  let prob_idx;
  for (prob_idx = 1; prob_idx < 25; prob_idx++) {
    if (ran_cell < probabilities[prob_idx]) {
      break;
    }
  }
  // console.log(probabilities);
  // console.log(prob_idx);
  let myrand = prob_idx - i - 1 + 24 * Math.floor(Math.random() * 4 + 3);
  for (let supa = 0; supa < myrand; supa++) {
    dels.push(speed(myrand, supa));
  }
  sound();

  var iters = 0;
  while (true) {
    var aux_index = i - dir;
    if (aux_index <= 0) {
      aux_index = 24 + aux_index;
    }
    if (aux_index == 25) {
      aux_index = 1;
    }
    elem = document.getElementById("_" + aux_index);
    for (let child of elem.children) {
      if (child.classList.contains(classname)) {
        elem.removeChild(child);
      }
    }
    elem = document.getElementById("_" + i);
    var a = document.createElement("div");
    a.classList.add(classname);
    elem.appendChild(a);
    i += dir;
    if (i == 25) {
      i = 1;
      time++;
    }
    if (i == 0) {
      i = 24;
      time++;
    }
    let spd = speed(myrand, iters);
    if (iters > myrand) {
      time = 0;
      i -= dir;
      if (i == 0) {
        i = 24;
      }
      if (i == 25) {
        i = 1;
      }
      return;
    }
    iters++;
    let delayres = await delay(spd);
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
  await run("bl_sq", 1, 100, 300);
  child = elem.lastElementChild;
  //   child.style.animationPlayState = "paused";
  child.style.animationName = "blink_low";

  // CHECK IF WIN
  // console.log("CASILLA GANADORA:: " + i);
  for (let element of bet_array) {
    if (element.index.includes(i) && element.bet > 0) {
      console.log("FRUTA GANADORA:: " + element.name);
      // heart special
      if (element.name == "heart") {
        if (!HEART_DONE.includes(i)) {
          document.getElementById("_" + i).classList.add("bonus_h");
          document.getElementById("h_" + i).style.filter = "saturate(100%)";
          HEART_DONE.push(i);
          if (HEART_DONE.length == 5) {
            for (let idx_h of element.index) {
              document.getElementById("h_" + idx_h).style.animationName =
                "win_heart";
              document.getElementById("_" + idx_h).style.animationName =
                "win_heart";
            }
            let delayres = await delay(4000);
            for (let idx_h of element.index) {
              document.getElementById("h_" + idx_h).style.animationName = "";
              document.getElementById("_" + idx_h).classList.remove("bonus_h");
              document.getElementById("h_" + idx_h).style.filter =
                "saturate(0)";
            }
            PREMIO += HEART_BONUS;
            HEART_BONUS = 0;
            HEART_DONE = [];
          }
        }
      }

      if (element.index_m.includes(i)) {
        PREMIO += element.win_m * element.bet;
      } else {
        PREMIO += element.win * element.bet;
      }
      break;
    }
    if (element.index.includes(i) && element.name == "heart") {
      HEART_BONUS += 5;
    }
  }
  // UPDATE VALUES
  const respuesta = fetch(
    "https://databasejson-1.herokuapp.com/?user=" +
      USER +
      "&credito=" +
      CREDITOS +
      "&premio=" +
      PREMIO +
      "&bonus=" +
      BONUS +
      "&hbonus=" +
      HEART_BONUS +
      "&hdone=" +
      JSON.stringify(HEART_DONE) +
      "&update=true"
  );

  // Update screen
  // console.log("PREMIO:: " + PREMIO);
  document.getElementById("premio_val").innerHTML = PREMIO;
  document.getElementById("full_bonus_id").innerHTML = BONUS;
  document.getElementById("heart_bonus_id").innerHTML = HEART_BONUS;

  // EMPTY BETS
  bet_array.forEach((element) => {
    element.bet = 0;
    var mybtn = document.getElementById(element.name + "_sel");
    mybtn.innerHTML = "";
    mybtn.style.backgroundPositionY = "50%";
  });

  btn.style.transform = "translateY(0%)";
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

async function sound() {
  // console.log("start sound");
  var times100 = Math.ceil(
    dels.filter((item) => item < 100).reduce((a, b) => a + b, 0) / 100
  );
  var firstStop = dels.findIndex((item) => item < 100);
  var secondStop = dels.findLastIndex((item) => item < 100);
  var context = new AudioContext();
  for (let i = 0; i < firstStop; i++) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    o.type = "triangle";
    o.frequency.value = 700;
    g.connect(context.destination);
    g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    o.start(context.currentTime);
    o.stop(context.currentTime + 0.4);
    let delayres = await delay(dels[i]);
  }
  for (let i = 0; i < times100; i++) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    o.type = "triangle";
    o.frequency.value = 700;
    g.connect(context.destination);
    g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    o.start(context.currentTime);
    o.stop(context.currentTime + 0.4);
    let delayres = await delay(100);
  }
  for (let i = secondStop; i < dels.length; i++) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    o.type = "triangle";
    o.frequency.value = 700;
    g.connect(context.destination);
    g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    o.start(context.currentTime);
    o.stop(context.currentTime + 0.4);
    let delayres = await delay(dels[i]);
  }
  // console.log("Finish sound");
  dels = [];
}

function pass_prize() {
  CREDITOS += PREMIO;
  PREMIO = 0;
  document.getElementById("premio_val").innerHTML = PREMIO;
  document.getElementById("credito_val").innerHTML = CREDITOS;
  // UPDATE VALUES
  const respuesta = fetch(
    "https://databasejson-1.herokuapp.com/?user=" +
      USER +
      "&credito=" +
      CREDITOS +
      "&premio=" +
      PREMIO +
      "&bonus=" +
      BONUS +
      "&hbonus=" +
      HEART_BONUS +
      "&hdone=" +
      JSON.stringify(HEART_DONE) +
      "&update=true"
  );
}

async function loadData() {
  const respuesta = await fetch(
    "https://databasejson-1.herokuapp.com/?user=" + USER
  );
  if (respuesta.status === 200) {
    let datos = await respuesta.json();
    CREDITOS = datos.credito;
    PREMIO = datos.premio;
    BONUS = datos.bonus;
    HEART_BONUS = datos.h_bonus;
    HEART_DONE = datos.h_done;

    document.getElementById("premio_val").innerHTML = PREMIO;
    document.getElementById("credito_val").innerHTML = CREDITOS;
    document.getElementById("full_bonus_id").innerHTML = BONUS;
    document.getElementById("heart_bonus_id").innerHTML = HEART_BONUS;

    for (let idx of HEART_DONE) {
      var myel = document.getElementById("_" + idx);
      var hel = document.getElementById("h_" + idx);
      myel.classList.add("bonus_h");
      hel.style.filter = "saturate(100%)";
    }

    bet_array[0].win = BONUS;
    // init_probabilities([0.3, 0.005, 0.004, 0.003, 0.0004, 0.0002, 0.0001]); // GOOD
  } else {
    console.log("ERROR");
    window.location.href = "/";
  }
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

loadData();

// CREDITOS = 10;
// PREMIO = 0;
// BONUS = 100;
// HEART_BONUS = 100;
// HEART_DONE = [2,6,10,16];

// document.getElementById("premio_val").innerHTML = PREMIO;
// document.getElementById("credito_val").innerHTML = CREDITOS;
// document.getElementById("full_bonus_id").innerHTML = BONUS;
// document.getElementById("heart_bonus_id").innerHTML = HEART_BONUS;

// for (let idx of HEART_DONE) {
//   var myel = document.getElementById("_" + idx);
//   var hel = document.getElementById("h_" + idx);
//   myel.classList.add("bonus_h");
//   hel.style.filter = "saturate(100%)";
// }

// bet_array[0].win = BONUS;
// init_probabilities([0.3, 0.005, 0.004, 0.003, 0.0004, 0.0002, 0.0001]); // GOOD
