const fetch = require("node-fetch");
const parseQuestions = require("./parseQuestions");

module.exports = function (id) {
  return new Promise(async resolve => {
    const quiz = await fetch(
      `https://quizizz.com/api/main/quiz/${id}?source=join`
    )
      .then(res => res.json())
      .catch(e => e);

    if (quiz.success === false)
      return resolve({
        code: /[A-Z_]+/.exec(quiz.error)[0],
        message: quiz.message
      });

    resolve({
      quizId: id,
      questions: parseQuestions(quiz.data.quiz.info.questions)
    });
  });
};
