const { readFile, writeFile } = require("fs");
const { join } = require("path");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({
  input,
  output,
});

let text = "";

writeFile(join(__dirname, "text.txt"), "", "utf-8", (err) => {
  if (err) throw err;
});

readFile(join(__dirname, "text.txt"), "utf-8", (err, data) => {
  if (err) throw err;
  if (data) text = data;

  console.log("Hi! Write your text here:");
  rl.on("line", (answer) => {
    if (answer == "exit") {
      rl.close();
      return;
    }

    text += answer;
    writeFile(join(__dirname, "text.txt"), text, "utf-8", (err) => {
      if (err) throw err;
    });
  });

  rl.on("close", () => {
    console.log(
      "\x1b[32m",
      "Your file has been written!!! Good luck",
      "\x1b[0m"
    );
  });
});
