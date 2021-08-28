const fetch = require("node-fetch");
const parseQuestions = require("./parseQuestions");

module.exports = async function (quizId, userId) {
  const room = await fetch("https://game.quizizz.com/play-api/v4/soloJoin", {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      quizId,
      player: {
        id: "me",
      },
      userId: userId,
      gameOptions: {
        showAnswers_2: "always",
      },
      locale: "en",
    }),
    method: "POST",
  }).then((res) => res.json());

  if (room.error) return NiceError(room);

  const questions = Object.keys(room.data.room.questions).map(
    (key) => room.data.room.questions[key]
  );
  const promises = [];
  questions.forEach((question, index) => {
    promises.push(
      new Promise((resolve) => {
        fetch("https://game.quizizz.com/play-api/v4/soloProceed", {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            roomHash: room.data.room.hash,
            playerId: "me",
            response: {
              questionId: question._id,
              provisional: {
                scores: { correct: 600, incorrect: 0 },
                scoreBreakups: {},
              },
              response: "get gnomed",
            },
            questionId: question._id,
            powerupEffects: { destroy: [] },
          }),
        })
          .then((res) => res.json())
          .then((j) => (questions[index].answer = j.data.question.structure))
          .then(() => resolve());
      })
    );
  });

  await Promise.all(promises);

  return {
    quizId: quizId,
    questions: parseQuestions(
      Object.keys(room.data.room.questions).map(
        (k) => room.data.room.questions[k]
      )
    ),
  };
};

function NiceError(error) {
  console.log(error);

  if (error.error.toLowerCase().includes("decrypt"))
    return {
      code: "BAD_DECRYPT",
      message: "QuizId decryption failed",
    };

  if (error.error.toLowerCase().includes("encoding"))
    return {
      code: "BAD_QUIZ_ID_LENGTH",
      message: "QuizId is the wrong length",
    };

  if (error.type === "game.PRIVATE_QUIZ_NOT_ALLOWED") {
    return {
      code: "PRIVATE_QUIZ",
      message: "Cannot get answers for private quiz",
    };
  }

  return {
    code: error.type,
    message: error.error,
  };
}
