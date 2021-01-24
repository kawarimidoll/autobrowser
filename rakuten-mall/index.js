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
  for (let i = 0; i < 10; i++) {
    try {
      await func(process.env.RAKUTEN_MAIL, process.env.RAKUTEN_PASS);
      return;
    } catch (e) {
      console.warn(e);
      console.warn("retry!");
    }
  }

  console.warn("Stop retrying because it failed 10 times.");
};

(async () => {
  console.log("rakuten-mall begin: ", getJST());

  await playMall(bingo);
  await playMall(minigame);
  await playMall(quiz);

  console.log("rakuten-mall end: ", getJST());
})();
