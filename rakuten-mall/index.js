require("dotenv").config();
const bingo = require("./bingo");
const minigame = require("./minigame");
const quiz = require("./quiz");

const getJST = () => new Date().toLocaleString({ timeZone: "Asia/Tokyo" });

if (!process.env.RAKUTEN_MAIL || !process.env.RAKUTEN_PASS) {
  console.error("env values are missing.");
  process.exit(1);
}

const playMall = async (func) => {
  let retry = true;

  for (let i = 0; i < 10 && retry; i++) {
    try {
      await func(process.env.RAKUTEN_MAIL ,process.env.RAKUTEN_PASS);
      retry = false;
    } catch (e) {
      retry = true;
      console.warn(e);
      console.warn("retry!");
    }
  }
  if (retry) {
    console.warn("Stop to retry because it failed 10 times.");
  }
};

(async () => {
  console.log("rakuten-mall begin: ", getJST());

  await playMall(bingo);
  await playMall(minigame);
  await playMall(quiz);

  console.log("rakuten-mall end: ", getJST());
})();
