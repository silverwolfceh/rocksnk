module.exports = function (questions) {
  return questions.map((question) => {
    question.structure.answer = question.answer.answer;
    if (question.answer.options)
      question.structure.options = question.answer.options;
    delete question.answer;
    delete question.cached;
    delete question.teleportFrom;
    delete question.__v;
    delete question.state;
    delete question.attempt;
    delete question.cause;
    delete question.published;
    delete question.standards;
    delete question.topics;
    delete question.isSuperParent;
    delete question._id;
    delete question.time;
    delete question.createdAt;
    delete question.updated;
    delete question.ver;
    delete question.structure.settings;
    delete question.structure.theme;
    question.type = question.structure.kind;
    delete question.structure.kind;
    question.structure.media = question.structure.media?.map((m) => {
      {
        delete m.meta;
        return m;
      }
    });
    question.structure.options = question.structure.options?.map((o) => {
      o.media = o.media.map((m) => {
        {
          delete m.meta;
          return m;
        }
      });
      return o;
    });
    return question;
  });
};
