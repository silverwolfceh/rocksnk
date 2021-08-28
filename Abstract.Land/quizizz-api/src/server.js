const app = require("express")();
const fetch = require("node-fetch");
const PORT = 8080;
const HOST = "0.0.0.0";
const GetAnswersFromLongId = require("./getAnswersFromLongId");
const GetAnswersFromShortId = require("./getAnswersFromShortId");

app.get("/", async (req, res) => {
  try {
    const corsWhitelist = ["http://127.0.0.1:8080", "https://quizizz.rocks"];
    const origin =
      req.headers["origin"] === undefined ? "*" : req.headers["origin"];
    res.set({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    });
    if (corsWhitelist.indexOf(origin) === -1)
      return res
        .status(400)
        .send({ message: "Not in CORS whitelist", code: "CORS_DENIED" });
    const url = new URL(`https://example.com${req.url}`);
    if (url.searchParams.has("quizid")) {
      if (url.searchParams.get("quizid").length !== 24)
        return res.status(400).send({
          messgae: "Long id not supported",
          code: "LONG_ID_NOT_SUPPORTED",
        });

      const answers = await GetAnswersFromShortId(
        url.searchParams.get("quizid")
      );
      if (answers.code) {
        res.status(400).send(answers);
      } else return res.send(answers);
    } else if (url.searchParams.has("pin")) {
      const roomDetails = await fetch(
        "https://game.quizizz.com/play-api/v4/checkRoom",
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ roomCode: url.searchParams.get("pin") }),
        }
      ).then((res) => res.json());

      if (roomDetails.error && !roomDetails.room?.quizId)
        return res.status(400).send({
          code: roomDetails.error.type,
          message: roomDetails.error.message,
        });

      const answers = await GetAnswersFromLongId(
        roomDetails.room.quizId,
        roomDetails.room.hostId
      );
      if (answers.code) {
        res.status(400).send(answers);
      } else return res.send(answers);
    } else
      return res
        .status(400)
        .send({ message: "Type was not specified", code: "TYPE_UNSPECIFIED" });
  } catch (e) {
    return res
      .status(500)
      .send({ error: true, message: e.message, code: e.name });
  }
});

app.get("/script", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain");
  res.send(
    "console.log(`https://quizizz.rocks/?pin=${JSON.parse(localStorage.previousContext).game.roomCode}`)"
  );
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
