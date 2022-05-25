const readline = require("readline");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({
  input,
  output,
});

let index = 0;
let n, k;

rl.on("line", (answer) => {
  if (index === 0) {
    [n, k] = answer.split(" ").map((el) => +el);
  } else {
    const per = answer.split(" ").map((el) => +el);
    let combinationsAmount = 0;
    getPers(per).forEach((el) => {
      combinations(el).forEach((arr) => {
        let isIncrease = true;
        console.log(arr);
        arr.forEach((num, i) => {
          if (arr[i + 1] && num < arr[i + 1]) {
            isIncrease = false;
          }
        });
        if (isIncrease) combinationsAmount++;
      });
    });
    console.log(combinationsAmount);
    rl.close();
  }
  index++;
});

function getPers(per) {
  const answers = [];
  const rec = (i) => {
    if (i > k) return;
    const el = per.slice(i, i + k);
    if (el.length < k) {

    } else {
      answers.push(el);
      rec(i + 1);
    }
  };
  rec(0);
  return answers;
}

function make(arr, el) {
  var i, i_m, item;
  var len = arr.length;
  var res = [];

  for (i = len; i >= 0; i--) {
    res.push([].concat(arr.slice(0, i), [el], arr.slice(i, i_m)));
  }

  return res;
}

function combinations(arr) {
  var prev, curr, el, i;
  var len = arr.length;

  curr = [[arr[0]]];

  for (i = 1; i < len; i++) {
    el = arr[i];
    prev = curr;
    curr = [];

    prev.forEach(function (item) {
      curr = curr.concat(make(item, el));
    });
  }

  return curr;
}
